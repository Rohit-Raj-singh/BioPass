# BioPass – Smart Biometric Attendance System 🔐

An IoT-based project to automate student attendance using:
- ESP8266 + R307 Fingerprint Sensor
- 4x4 Keypad via PCF8574 (I2C)
- OLED Display (SSD1306)
- Node.js + Express + MongoDB backend
- SMS alert via API
- Web admin panel for data management

## Folder Structure
- Biopass.ino → firmware
- backend/ → Node.js + MongoDB API
- frontend/ → Web dashboard

## Features
✅ Fingerprint-based student verification  
✅ Admin login with OTP  
✅ WiFi setup via keypad (WiFiManager)  
✅ Real-time attendance + SMS alert  
✅ Web interface + REST API

## Hardware image💻
<img src = "https://github.com/user-attachments/assets/675b82db-a075-4df1-a927-870d6e2d7e91" width="500/>

<img src = "https://github.com/user-attachments/assets/bd18cc91-3370-4adb-8722-8cda2bd71e52" width="500/>

<img src = "https://github.com/user-attachments/assets/3e66285d-6ccd-43c5-90a0-e0bc90ea05c2" width="500/>

<img src = "https://github.com/user-attachments/assets/da71b1a2-677e-4aa4-8596-9ecf82e2671c" width="500/>

<img src = "https://github.com/user-attachments/assets/fe906f15-0bd9-4992-b28a-21664ca865c5" width="500/>

## Software💻
<img src = "https://github.com/user-attachments/assets/6ef3db4a-09fb-4ed6-84f1-99bf6be22070" width="500/>

<img src = "https://github.com/user-attachments/assets/79af6b7f-f37b-47aa-9b93-18cd1afadffb" width="500/>

<img src = "https://github.com/user-attachments/assets/6d308128-09fc-430d-928f-746c154722f5" width="500/>

<img src = "https://github.com/user-attachments/assets/1bf31942-6b18-4950-bde4-60d260bf4ed4" width="500/>

<img src = "https://github.com/user-attachments/assets/812c358b-b81e-404c-8611-e724970d12d0" width="500/>

## How to Run
1. Upload firmware to ESP8266
2. Run `npm install` in backend folder
3. Configure MongoDB & SMS API keys
4. Start server using `node server.js`

## Author
Rohit Raj
