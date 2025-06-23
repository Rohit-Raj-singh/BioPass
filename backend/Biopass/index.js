const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biometric_attendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Twilio Configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Define MongoDB Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  fingerprintId: { type: Number, required: true, unique: true },
  registeredAt: { type: Date, default: Date.now }
});

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  timestamp: { type: Date, default: Date.now },
  // You can add more fields like location, device ID, etc.
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// API Routes

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, registrationNumber, mobileNumber, email, fingerprintId } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [
        { registrationNumber },
        { fingerprintId }
      ]
    });
    
    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student with this registration number or fingerprint ID already exists' 
      });
    }
    
    // Create new student
    const student = new Student({
      name,
      registrationNumber,
      mobileNumber,
      email,
      fingerprintId
    });
    
    await student.save();
    
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Attendance marking endpoint
app.post('/api/attendance', async (req, res) => {
  try {
    const { fingerprintId } = req.body;
    
    // Find student by fingerprint ID
    const student = await Student.findOne({ fingerprintId });
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'No student found with this fingerprint ID' 
      });
    }
    
    // Check if attendance already marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingAttendance = await Attendance.findOne({
      studentId: student._id,
      timestamp: { $gte: today, $lt: tomorrow }
    });
    
    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        message: 'Attendance already marked for today',
        name: student.name,
        mobileNumber: student.mobileNumber,
        timestamp: existingAttendance.timestamp,
        alreadyMarked: true
      });
    }
    
    // Create new attendance record
    const attendance = new Attendance({
      studentId: student._id
    });
    
    await attendance.save();
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      name: student.name,
      mobileNumber: student.mobileNumber,
      timestamp: attendance.timestamp
    });
  } catch (error) {
    console.error('Attendance marking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during attendance marking',
      error: error.message
    });
  }
});

// SMS sending endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message, type } = req.body;
    
    // Format the phone number with international code if needed
    let formattedNumber = to;
    if (!to.startsWith('+')) {
      formattedNumber = `+${to}`; // Default adding + for international format
    }
    
    // Send SMS via Twilio
    const smsResponse = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedNumber
    });
    
    res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      sid: smsResponse.sid
    });
  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while sending SMS',
      error: error.message
    });
  }
});

// Get all students (for testing purposes)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().select('-__v');
    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching students',
      error: error.message
    });
  }
});

// Get attendance records by date range
app.get('/api/attendance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.timestamp = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const attendance = await Attendance.find(query)
      .populate('studentId', 'name registrationNumber')
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching attendance records',
      error: error.message
    });
  }
});

// Get attendance report for a specific student
app.get('/api/attendance/student/:registrationNumber', async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    const { startDate, endDate } = req.query;
    
    // Find student by registration number
    const student = await Student.findOne({ registrationNumber });
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'No student found with this registration number' 
      });
    }
    
    // Build query for attendance records
    let query = { studentId: student._id };
    
    if (startDate && endDate) {
      query.timestamp = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const attendanceRecords = await Attendance.find(query)
      .select('timestamp -_id')
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      student: {
        name: student.name,
        registrationNumber: student.registrationNumber,
        email: student.email
      },
      count: attendanceRecords.length,
      attendance: attendanceRecords
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching student attendance records',
      error: error.message
    });
  }
});


