import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSchedule } from '../context/ScheduleContext';
import { Calendar, Clock, BookOpen, UserCheck, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { classes, appointments } = useSchedule();

  const renderStudentDashboard = () => (
    <div className="dashboard-grid">
      <div className="card overview-card primary-gradient">
        <div className="overview-icon"><Calendar size={24} /></div>
        <div className="overview-info">
          <h3>Upcoming Classes</h3>
          <p className="overview-value">3 Today</p>
        </div>
      </div>
      <div className="card overview-card success-gradient">
        <div className="overview-icon"><BookOpen size={24} /></div>
        <div className="overview-info">
          <h3>Registered Courses</h3>
          <p className="overview-value">5</p>
        </div>
      </div>
      <div className="card overview-card warning-gradient">
        <div className="overview-icon"><Clock size={24} /></div>
        <div className="overview-info">
          <h3>Pending Appointments</h3>
          <p className="overview-value">{appointments.filter(a => a.studentId === user?._id && a.status === 'pending').length}</p>
        </div>
      </div>

      <div className="card full-width">
        <div className="card-header">
          <h3>Today's Schedule</h3>
          <button className="btn btn-outline text-sm">View Full Timetable</button>
        </div>
        <div className="schedule-list">
          {classes.slice(0, 3).map((cls, idx) => (
            <div key={idx} className="schedule-item">
              <div className="time-block">
                <span className="start-time">{cls.startTime}</span>
                <span className="end-time">{cls.endTime}</span>
              </div>
              <div className="schedule-details">
                <h4>{cls.type === 'lecture' ? 'Lecture' : 'Lab'} - CS30{idx + 1}</h4>
                <p className="text-muted text-sm">Room: {cls.roomId}</p>
              </div>
              <div className="badge badge-primary">{cls.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFacultyDashboard = () => (
    <div className="dashboard-grid">
      <div className="card overview-card primary-gradient">
        <div className="overview-icon"><UserCheck size={24} /></div>
        <div className="overview-info">
          <h3>Appointment Requests</h3>
          <p className="overview-value">{appointments.filter(a => a.facultyId === user?._id && a.status === 'pending').length}</p>
        </div>
      </div>
      <div className="card overview-card info-gradient">
        <div className="overview-icon"><BookOpen size={24} /></div>
        <div className="overview-info">
          <h3>Assigned Classes</h3>
          <p className="overview-value">{classes.filter(c => c.facultyId === user?._id).length}</p>
        </div>
      </div>
      <div className="card overview-card warning-gradient">
        <div className="overview-icon"><Activity size={24} /></div>
        <div className="overview-info">
          <h3>Next Class In</h3>
          <p className="overview-value">2h 15m</p>
        </div>
      </div>

      <div className="card full-width">
        <div className="card-header">
          <h3>Pending Appointment Requests</h3>
        </div>
        <div className="appointment-requests">
          {appointments.filter(a => a.facultyId === user?._id && a.status === 'pending').map(app => (
            <div key={app._id} className="request-card">
              <div className="request-info">
                <h4>{app.topic}</h4>
                <p className="text-sm text-muted">Student ID: {app.studentId} • {app.date} at {app.startTime}</p>
                <div className={`badge ${app.type === 'virtual' ? 'badge-info' : 'badge-primary'} mt-2`}>
                  {app.type}
                </div>
              </div>
              <div className="request-actions">
                <button className="btn btn-outline" style={{ borderColor: 'var(--success-500)', color: 'var(--success-500)' }}>Approve</button>
                <button className="btn btn-outline" style={{ borderColor: 'var(--danger-500)', color: 'var(--danger-500)' }}>Decline</button>
              </div>
            </div>
          ))}
          {appointments.filter(a => a.facultyId === user?._id && a.status === 'pending').length === 0 && (
             <p className="text-muted text-center py-4">No pending requests</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-grid">
       <div className="card overview-card primary-gradient">
        <div className="overview-icon"><BookOpen size={24} /></div>
        <div className="overview-info">
          <h3>Total Courses</h3>
          <p className="overview-value">124</p>
        </div>
      </div>
      <div className="card overview-card info-gradient">
        <div className="overview-icon"><UserCheck size={24} /></div>
        <div className="overview-info">
          <h3>Active Faculty</h3>
          <p className="overview-value">45</p>
        </div>
      </div>
      <div className="card overview-card success-gradient">
        <div className="overview-icon"><Calendar size={24} /></div>
        <div className="overview-info">
          <h3>Rooms Allocated</h3>
          <p className="overview-value">85%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p className="text-muted">Here is what's happening today.</p>
      </div>

      {user?.role === 'student' && renderStudentDashboard()}
      {user?.role === 'faculty' && renderFacultyDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;
