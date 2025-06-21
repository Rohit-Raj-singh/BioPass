import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  BarChart2, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data for the dashboard
  const stats = [
    { title: 'Total Students', value: '1,247', change: '+5%', trend: 'up' },
    { title: 'Today\'s Attendance', value: '87%', change: '+2%', trend: 'up' },
    { title: 'Missing Students', value: '24', change: '-3%', trend: 'down' },
    { title: 'Classes Today', value: '18', change: '0%', trend: 'neutral' }
  ];
  
  const recentActivity = [
    { id: 1, name: 'Emma Thompson', action: 'Checked in', time: '2 minutes ago', class: 'Biology 101' },
    { id: 2, name: 'James Wilson', action: 'Checked in', time: '5 minutes ago', class: 'Physics 202' },
    { id: 3, name: 'Olivia Martinez', action: 'Checked in', time: '8 minutes ago', class: 'Chemistry 101' },
    { id: 4, name: 'Daniel Johnson', action: 'Missed', time: '15 minutes ago', class: 'Mathematics 301' },
    { id: 5, name: 'Sophia Brown', action: 'Checked in', time: '20 minutes ago', class: 'English 202' }
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for larger screens */}
      <aside className={`bg-blue-800 text-white w-64 fixed h-full z-20 transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold">BioPass</span>
            <span className="ml-1 text-blue-300 text-sm">Admin</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 mb-4 text-sm text-blue-300">MAIN MENU</div>
          <a href="#" className="flex items-center px-4 py-3 text-blue-100 bg-blue-900">
            <BarChart2 className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition">
            <Users className="w-5 h-5 mr-3" />
            Students
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition">
            <Clock className="w-5 h-5 mr-3" />
            Attendance
          </a>
          
          <div className="px-4 mb-4 mt-8 text-sm text-blue-300">SETTINGS</div>
          <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition">
            <User className="w-5 h-5 mr-3" />
            Your Profile
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition">
            <Settings className="w-5 h-5 mr-3" />
            System Settings
          </a>
          <Link to="/" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Link>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        {/* Top navigation */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4 md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            <button className="relative text-gray-500 hover:text-gray-700 mr-4">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                <span className="font-semibold">A</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Recent activity */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="flex items-center">
                <button className="mr-2 p-2 hover:bg-gray-100 rounded">
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
                <button className="mr-2 p-2 hover:bg-gray-100 rounded">
                  <Filter className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="py-3 px-6 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{activity.name}</div>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          activity.action === 'Checked in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.action}
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-gray-600">
                        {activity.class}
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-gray-500 text-sm">
                        {activity.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition">
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Register New Student
                  </span>
                  <span>→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition">
                  <span className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Attendance Report
                  </span>
                  <span>→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition">
                  <span className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure System Settings
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">System Notifications</h2>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
                  <h3 className="font-medium mb-1">Low Attendance Alert</h3>
                  <p className="text-sm">Computer Science 202 has below 75% attendance today.</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
                  <h3 className="font-medium mb-1">Database Backup Complete</h3>
                  <p className="text-sm">Daily database backup completed successfully.</p>
                </div>
                <div className="p-3 bg-green-50 text-green-700 rounded-md">
                  <h3 className="font-medium mb-1">New Update Available</h3>
                  <p className="text-sm">BioPass system update v2.4 is available for installation.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t mt-auto p-6">
          <div className="text-center text-gray-500 text-sm">
            © 2025 BioPass. All rights reserved. <span className="text-blue-500">Admin Panel v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;