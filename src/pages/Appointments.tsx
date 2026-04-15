import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSchedule } from '../context/ScheduleContext';
import type { Appointment } from '../context/ScheduleContext';
import { Calendar, Clock, Video, Users, Plus, X } from 'lucide-react';
import './Appointments.css';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const { appointments, bookAppointment, updateAppointmentStatus } = useSchedule();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [newAppt, setNewAppt] = useState({
    facultyId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'virtual' as 'virtual' | 'in-person',
    topic: ''
  });

  const myAppointments = appointments.filter(a => user?.role === 'student' ? a.studentId?._id === user._id : a.facultyId?._id === user?._id);

  useEffect(() => {
    if (isModalOpen) {
      fetch('/api/users').then(res => res.json()).then(users => {
        const facs = users.filter((u: any) => u.role === 'faculty');
        setFaculties(facs);
        if (facs.length > 0) {
          setNewAppt(prev => ({ ...prev, facultyId: facs[0]._id }));
        }
      });
    }
  }, [isModalOpen]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if(user && user.role === 'student' && newAppt.facultyId) {
      await bookAppointment({
        ...newAppt,
        studentId: user._id
      });
      setIsModalOpen(false);
      setNewAppt({ facultyId: faculties[0]?._id, date: '', startTime: '', endTime: '', type: 'virtual', topic: '' });
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'approved': return <span className="badge badge-success">Approved</span>;
      case 'pending': return <span className="badge badge-warning">Pending</span>;
      case 'declined': return <span className="badge badge-danger">Declined</span>;
      default: return null;
    }
  };

  return (
    <div className="appointments-page">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Appointments</h2>
          <p className="text-muted">Manage your office hours and meetings</p>
        </div>
        {user?.role === 'student' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Book Appointment
          </button>
        )}
      </div>

      <div className="appointments-list">
        {myAppointments.length > 0 ? myAppointments.map(app => (
          <div key={app._id} className="card appointment-card">
            <div className="appointment-header flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{app.topic}</h3>
                <p className="text-muted text-sm">
                  With: {user?.role === 'student' ? (app.facultyId?.name || 'Faculty') : (app.studentId?.name || 'Student')}
                </p>
              </div>
              {getStatusBadge(app.status)}
            </div>
            
            <div className="appointment-details flex gap-4 text-sm text-secondary mb-4">
              <div className="flex items-center gap-2"><Calendar size={16} /> {app.date}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {app.startTime} - {app.endTime}</div>
              <div className="flex items-center gap-2 text-primary-600 font-medium">
                {app.type === 'virtual' ? <Video size={16} /> : <Users size={16} />} 
                <span className="capitalize">{app.type}</span>
              </div>
            </div>

            {user?.role === 'faculty' && app.status === 'pending' && (
              <div className="flex gap-2 border-t pt-4 mt-2" style={{ borderColor: 'var(--border-color)' }}>
                <button className="btn btn-outline flex-1" onClick={() => updateAppointmentStatus(app._id, 'approved')}>Approve</button>
                <button className="btn btn-outline flex-1" style={{ color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => updateAppointmentStatus(app._id, 'declined')}>Decline</button>
              </div>
            )}
          </div>
        )) : (
           <div className="card text-center py-8 text-muted w-full" style={{ gridColumn: 'span 3' }}>
             No appointments found.
           </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header flex justify-between items-center mb-6">
              <h3>Book Appointment</h3>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleBook} className="flex-col gap-4">
              <div className="input-group">
                <label className="input-label">Faculty</label>
                <select className="input-field" value={newAppt.facultyId} onChange={e => setNewAppt({...newAppt, facultyId: e.target.value})} required>
                  {faculties.map(f => (
                    <option key={f._id} value={f._id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Topic</label>
                <input type="text" className="input-field" placeholder="e.g. Project Discussion" value={newAppt.topic} onChange={e => setNewAppt({...newAppt, topic: e.target.value})} required />
              </div>
              
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label className="input-label">Date</label>
                  <input type="date" className="input-field" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} required />
                </div>
                <div className="input-group w-full">
                  <label className="input-label">Start Time</label>
                  <input type="time" className="input-field" value={newAppt.startTime} onChange={e => setNewAppt({...newAppt, startTime: e.target.value})} required />
                </div>
                <div className="input-group w-full">
                  <label className="input-label">End Time</label>
                  <input type="time" className="input-field" value={newAppt.endTime} onChange={e => setNewAppt({...newAppt, endTime: e.target.value})} required />
                </div>
              </div>

              <div className="input-group mb-6">
                <label className="input-label">Meeting Type</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={newAppt.type === 'virtual'} onChange={() => setNewAppt({...newAppt, type: 'virtual'})} /> Virtual
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={newAppt.type === 'in-person'} onChange={() => setNewAppt({...newAppt, type: 'in-person'})} /> In-person
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
