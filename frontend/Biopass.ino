#include <Wire.h>
#include <PCF8574.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>

// OLED display configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1  
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Keypad configuration
#define ROWS 4
#define COLS 4
PCF8574 pcf8574(0x20);  

// Fingerprint sensor configuration
SoftwareSerial mySerial(D5, D6); // RX, TX for fingerprint sensor
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// Keypad mapping
char keyMap[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

const char* keyChars[] = {
  "1.+", "2ABC", "3DEF",
  "4GHI", "5JKL", "6MNO",
  "7PQRS", "8TUV", "9WXYZ",
  "0 ", "", ""
};

byte rowPins[ROWS] = {0, 1, 2, 3}; 
byte colPins[COLS] = {4, 5, 6, 7};

// Input fields for registration
String inputFields[4] = {"", "", "", ""};  // Name, RegNumber, MobileNumber, Email
int currentField = 0;  // 0->Name, 1->RegNumber, 2->MobileNumber, 3->Email
char lastKey = 0;
int charIndex = 0;
unsigned long lastPressTime = 0;
const int inputTimeout = 600;

// System modes
enum SystemMode {
  MAIN_MENU,
  REGISTER_STUDENT,
  ENROLL_FINGERPRINT,
  VERIFY_ATTENDANCE
};

SystemMode currentMode = MAIN_MENU;
int fingerprintID = 0;
bool fingerprintEnrolled = false;

// Configuration parameters
char serverUrl[80] = "http://192.168.4.28:5000/api";  // Base API URL
char registerUrl[100] = "";
char attendanceUrl[100] = "";
char smsApiUrl[100] = "";

// WiFiManager object
WiFiManager wifiManager;

void setup() {
  Serial.begin(9600);
  
  // Initialize fingerprint sensor
  finger.begin(57600);
  delay(5);
  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor connected!");
  } else {
    Serial.println("Fingerprint sensor not found!");
  }
  
  // Initialize I2C and display
  Wire.begin();
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println("SSD1306 allocation failed");
    for (;;);
  }

  // Set up keypad
  for (int i = 0; i < ROWS; i++) {
    pcf8574.pinMode(rowPins[i], INPUT_PULLUP); 
  }

  for (int j = 0; j < COLS; j++) {
    pcf8574.pinMode(colPins[j], OUTPUT);
    pcf8574.digitalWrite(colPins[j], HIGH);
  }

  pcf8574.begin();
  Serial.println("Keypad Ready!");

  // Display welcome message
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Starting...");
  display.println("Biometric Attendance");
  display.println("System Initializing");
  display.display();
  
  // WiFiManager configuration
  WiFiManagerParameter custom_server_url("server", "Server Base URL", serverUrl, 80);
  wifiManager.addParameter(&custom_server_url);
  
  // Set callback for entering configuration mode
  wifiManager.setAPCallback(configModeCallback);
  
  // Try to connect to saved WiFi
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Connecting to WiFi...");
  display.display();
  
  if (!wifiManager.autoConnect("BiometricSetup", "password123")) {
    startConfigPortal();
  } else {
    // Save the custom parameters
    strcpy(serverUrl, custom_server_url.getValue());
    
    // Construct API endpoints
    sprintf(registerUrl, "%s/register", serverUrl);
    sprintf(attendanceUrl, "%s/attendance", serverUrl);
    sprintf(smsApiUrl, "%s/send-sms", serverUrl);
    
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Connected to WiFi:");
    display.println(WiFi.SSID());
    display.println("IP: " + WiFi.localIP().toString());
    display.display();
    delay(2000);
  }
  
  showMainMenu();
}

void configModeCallback(WiFiManager *myWiFiManager) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi Config Mode");
  display.println("Connect to:");
  display.println("SSID: BiometricSetup");
  display.println("Password: password123");
  display.println("IP: 192.168.4.1");
  display.display();
}

void startConfigPortal() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Starting config portal");
  display.println("Connect to WiFi:");
  display.println("SSID: BiometricSetup");
  display.println("Password: password123");
  display.display();
  
  // Start config portal
  wifiManager.startConfigPortal("BiometricSetup", "password123");
  
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Connected to WiFi:");
  display.println(WiFi.SSID());
  display.println("IP: " + WiFi.localIP().toString());
  display.display();
  delay(2000);
  
  showMainMenu();
}

void showMainMenu() {
  currentMode = MAIN_MENU;
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Biometric Attendance");
  display.println("-------------------");
  display.println("A: Register New Student");
  display.println("B: Mark Attendance");
  display.println("C: WiFi Settings");
  display.println("D: System Info");
  display.display();
}

void showRegistrationForm() {
  currentMode = REGISTER_STUDENT;
  for (int i = 0; i < 4; i++) {
    inputFields[i] = "";
  }
  currentField = 0;
  updateRegistrationDisplay();
}

void updateRegistrationDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Student Registration");
  display.println("-------------------");
  display.print("Name: "); display.println(inputFields[0]);
  display.print("Reg#: "); display.println(inputFields[1]);
  display.print("Mobile: "); display.println(inputFields[2]);
  display.print("Email: "); display.println(inputFields[3]);
  
  display.setCursor(0, 56);
  display.print("Field: ");
  String fieldNames[] = {"Name", "Reg#", "Mobile", "Email"};
  display.print(fieldNames[currentField]);
  display.display();
}

char scanKeypad() {
  for (byte col = 0; col < COLS; col++) {
    pcf8574.digitalWrite(colPins[col], LOW);
    for (byte row = 0; row < ROWS; row++) {
      if (pcf8574.digitalRead(rowPins[row]) == LOW) {
        while (pcf8574.digitalRead(rowPins[row]) == LOW);
        pcf8574.digitalWrite(colPins[col], HIGH);
        return keyMap[row][col];
      }
    }
    pcf8574.digitalWrite(colPins[col], HIGH);
  }
  return 0;
}

void processMainMenuKey(char key) {
  switch (key) {
    case 'A':
      showRegistrationForm();
      break;
    case 'B':
      startAttendanceMode();
      break;
    case 'C':
      wifiManager.resetSettings();
      startConfigPortal();
      break;
    case 'D':
      showSystemInfo();
      break;
  }
}

void showSystemInfo() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("System Information:");
  display.println("-------------------");
  if (WiFi.status() == WL_CONNECTED) {
    display.println("WiFi: " + WiFi.SSID());
    display.println("IP: " + WiFi.localIP().toString());
    display.println("Signal: " + String(WiFi.RSSI()) + " dBm");
  } else {
    display.println("WiFi: Not connected");
  }
  display.println("API: " + String(serverUrl));
  display.display();
  delay(5000);
  showMainMenu();
}

void processRegistrationKey(char key) {
  unsigned long now = millis();

  if (key >= '1' && key <= '9') {
    int keyNum = key - '1';
    
    if (key == lastKey && now - lastPressTime < inputTimeout) {
      charIndex = (charIndex + 1) % strlen(keyChars[keyNum]);
      inputFields[currentField].remove(inputFields[currentField].length() - 1);
      inputFields[currentField] += keyChars[keyNum][charIndex];
    } else {
      inputFields[currentField] += keyChars[keyNum][0];
      charIndex = 0;
    }

    lastKey = key;
    lastPressTime = now;
  } 
  else if (key == '0') {
    inputFields[currentField] += '0';
  } 
  else if (key == '*') {
    if (!inputFields[currentField].isEmpty()) {
      inputFields[currentField].remove(inputFields[currentField].length() - 1);
    }
  } 
  else if (key == '#') {
    if (currentField < 3) {
      currentField++;
    } else {
      // Move to fingerprint enrollment
      startFingerprintEnrollment();
      return;
    }
  }
  else if (key == 'D') {
    showMainMenu();
    return;
  }
  
  updateRegistrationDisplay();
}

void startFingerprintEnrollment() {
  currentMode = ENROLL_FINGERPRINT;
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Fingerprint Enrollment");
  display.println("--------------------");
  display.println("Press # to start");
  display.println("Press D to cancel");
  display.display();
}

void processFingerprintEnrollmentKey(char key) {
  if (key == '#') {
    // Generate a fingerprint ID based on registration number
    fingerprintID = abs(inputFields[1].toInt()) % 127 + 1;
    enrollFingerprint(fingerprintID);
  } else if (key == 'D') {
    showMainMenu();
  }
}

void enrollFingerprint(uint8_t id) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Enrolling Fingerprint");
  display.println("--------------------");
  display.println("Place finger on sensor");
  display.display();
  
  int p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        display.println("Image taken");
        display.display();
        break;
      case FINGERPRINT_NOFINGER:
        // Waiting for finger
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        display.println("Communication error");
        display.display();
        delay(2000);
        showMainMenu();
        return;
      case FINGERPRINT_IMAGEFAIL:
        display.println("Imaging error");
        display.display();
        delay(2000);
        showMainMenu();
        return;
      default:
        display.println("Unknown error");
        display.display();
        delay(2000);
        showMainMenu();
        return;
    }
  }

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      display.println("Image converted");
      display.display();
      break;
    default:
      display.println("Conversion error");
      display.display();
      delay(2000);
      showMainMenu();
      return;
  }
  
  display.println("Remove finger");
  display.display();
  delay(2000);
  
  display.println("Place same finger again");
  display.display();
  
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      display.println("Image taken");
      display.display();
    }
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    display.println("Conversion error");
    display.display();
    delay(2000);
    showMainMenu();
    return;
  }

  p = finger.createModel();
  if (p != FINGERPRINT_OK) {
    display.println("Fingerprints didn't match");
    display.display();
    delay(2000);
    showMainMenu();
    return;
  }

  p = finger.storeModel(id);
  if (p != FINGERPRINT_OK) {
    display.println("Error storing fingerprint");
    display.display();
    delay(2000);
    showMainMenu();
    return;
  }

  display.println("Fingerprint enrolled!");
  display.display();
  delay(1000);
  
  // Send registration data to server
  sendRegistrationData(id);
}

void sendRegistrationData(uint8_t fingerprintId) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Sending data...");
  display.display();
  
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, registerUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<400> jsonDoc;
    jsonDoc["name"] = inputFields[0];
    jsonDoc["registrationNumber"] = inputFields[1];
    jsonDoc["mobileNumber"] = inputFields[2];
    jsonDoc["email"] = inputFields[3];
    jsonDoc["fingerprintId"] = fingerprintId;

    String jsonString;
    serializeJson(jsonDoc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      display.println("Registration successful!");
      display.display();
      delay(2000);
      
      // Send SMS notification
      sendRegistrationSMS(inputFields[2], inputFields[0]);
    } else {
      display.println("Error: " + http.errorToString(httpResponseCode));
      display.display();
      delay(2000);
    }
    
    http.end();
  } else {
    display.println("WiFi disconnected");
    display.println("Registration failed");
    display.display();
    delay(2000);
  }
  
  showMainMenu();
}

void sendRegistrationSMS(String phoneNumber, String name) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, smsApiUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<400> jsonDoc;
    jsonDoc["to"] = phoneNumber;
    jsonDoc["message"] = "Hello " + name + ", your biometric registration was successful! Welcome to the College Attendance System.";
    jsonDoc["type"] = "registration";

    String jsonString;
    serializeJson(jsonDoc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      display.clearDisplay();
      display.setCursor(0, 0);
      display.println("SMS sent successfully!");
      display.display();
      delay(2000);
    }
    
    http.end();
  }
}

void startAttendanceMode() {
  currentMode = VERIFY_ATTENDANCE;
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Attendance Mode");
  display.println("---------------");
  display.println("Place finger on sensor");
  display.println("Press D to cancel");
  display.display();
}

void processAttendanceMode() {
  // Check for fingerprint
  int fingerId = getFingerprintID();
  
  if (fingerId > 0) {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Fingerprint matched!");
    display.println("ID: " + String(fingerId));
    display.println("Sending attendance...");
    display.display();
    
    // Send attendance to server
    markAttendance(fingerId);
  }
  
  // Check for 'D' key to exit
  char key = scanKeypad();
  if (key == 'D') {
    showMainMenu();
  }
}

int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -1;
  
  return finger.fingerID;
}

void markAttendance(uint8_t fingerprintId) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, attendanceUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> jsonDoc;
    jsonDoc["fingerprintId"] = fingerprintId;
    // Server will add timestamp

    String jsonString;
    serializeJson(jsonDoc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      
      // Parse response to get student details
      StaticJsonDocument<400> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, response);
      
      if (!error) {
        String studentName = responseDoc["name"].as<String>();
        String mobileNumber = responseDoc["mobileNumber"].as<String>();
        
        display.clearDisplay();
        display.setCursor(0, 0);
        display.println("Attendance marked!");
        display.println("Name: " + studentName);
        display.display();
        delay(2000);
        
        // Send attendance confirmation SMS
        sendAttendanceSMS(mobileNumber, studentName);
      }
    } else {
      display.clearDisplay();
      display.setCursor(0, 0);
      display.println("Attendance failed!");
      display.println("Error: " + http.errorToString(httpResponseCode));
      display.display();
      delay(2000);
    }
    
    http.end();
  } else {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("WiFi disconnected");
    display.println("Attendance failed");
    display.display();
    delay(2000);
  }
  
  showMainMenu();
}

void sendAttendanceSMS(String phoneNumber, String name) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, smsApiUrl);
    http.addHeader("Content-Type", "application/json");

    // Get current time from server response
    String currentDate = "Today"; // The actual date will be added by the server

    StaticJsonDocument<400> jsonDoc;
    jsonDoc["to"] = phoneNumber;
    jsonDoc["message"] = "Hello " + name + ", your attendance has been marked for " + currentDate + " at ABC College.";
    jsonDoc["type"] = "attendance";

    String jsonString;
    serializeJson(jsonDoc, jsonString);

    http.POST(jsonString);
    http.end();
  }
}

void loop() {
  char key = scanKeypad();
  
  if (key) {
    Serial.print("Key Pressed: ");
    Serial.println(key);
    
    // Process the key based on current mode
    switch (currentMode) {
      case MAIN_MENU:
        processMainMenuKey(key);
        break;
      case REGISTER_STUDENT:
        processRegistrationKey(key);
        break;
      case ENROLL_FINGERPRINT:
        processFingerprintEnrollmentKey(key);
        break;
      case VERIFY_ATTENDANCE:
        if (key == 'D') showMainMenu();
        break;
    }
    
    delay(300);
  }
  
  // Continuously check for fingerprint in attendance mode
  if (currentMode == VERIFY_ATTENDANCE) {
    processAttendanceMode();
  }
  
  // Check if WiFi is still connected
  if (WiFi.status() != WL_CONNECTED) {
    static unsigned long lastReconnectAttempt = 0;
    unsigned long now = millis();
    
    // Try to reconnect every 30 seconds
    if (now - lastReconnectAttempt > 30000) {
      lastReconnectAttempt = now;
      wifiManager.autoConnect();
    }
  }
}
