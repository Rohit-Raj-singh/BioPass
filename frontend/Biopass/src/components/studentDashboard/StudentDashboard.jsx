import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const StudentDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-blue-500 text-xl font-bold">BioPass</span>
                        <span className="ml-2 text-gray-500">| Student Dashboard</span>
                    </div>
                    <div>
                        <Link 
                            to="/" 
                            className="text-gray-600 hover:text-blue-500 transition"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Student Dashboard</h1>
                
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <p className="text-gray-600">
                        This is a placeholder for the student dashboard. Here you would see your attendance 
                        records, upcoming classes, and other relevant information.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AttendanceSummary />
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                        <ul className="space-y-3">
                            <li className="pb-2 border-b border-gray-100">
                                <div className="text-sm text-gray-800">Attended: Introduction to Biology</div>
                                <div className="text-xs text-gray-500">Today, 10:30 AM</div>
                            </li>
                            <li className="pb-2 border-b border-gray-100">
                                <div className="text-sm text-gray-800">Attended: Advanced Mathematics</div>
                                <div className="text-xs text-gray-500">Yesterday, 2:15 PM</div>
                            </li>
                            <li>
                                <div className="text-sm text-gray-800">Missed: Physics Lab</div>
                                <div className="text-xs text-gray-500">May 5, 2025, 9:00 AM</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
            
            <footer className="bg-white mt-auto py-6">
                <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
                    © 2025 BioPass. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const AttendanceSummary = () => {
    const [attendanceData, setAttendanceData] = useState({
        presentDays: 0,
        absentDays: 0,
        attendancePercent: 0,
    });

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get('/api/attendance'); // Replace with your API endpoint
            setAttendanceData(response.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Attendance Summary', 10, 10);
        doc.text(`Present Days: ${attendanceData.presentDays}`, 10, 20);
        doc.text(`Absent Days: ${attendanceData.absentDays}`, 10, 30);
        doc.text(`Attendance Percentage: ${attendanceData.attendancePercent}%`, 10, 40);
        doc.save('attendance-summary.pdf');
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-bold">Present Days</h3>
                    <p className="text-2xl">{attendanceData.presentDays || 0}</p>
                </div>
                <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-bold">Absent Days</h3>
                    <p className="text-2xl">{attendanceData.absentDays || 0}</p>
                </div>
                <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-bold">Attendance %</h3>
                    <p className="text-2xl">{attendanceData.attendancePercent || 0}%</p>
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    onClick={fetchAttendanceData}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Refresh
                </button>
                <button
                    onClick={exportToPDF}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Export to PDF
                </button>
            </div>
        </div>
    );
};

export default StudentDashboard;


