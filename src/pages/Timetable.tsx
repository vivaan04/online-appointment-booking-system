import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import './Timetable.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const Timetable: React.FC = () => {
  const { classes } = useSchedule();
  const [currentWeekTop, setCurrentWeekTop] = useState(new Date());

  const startOfCurrentWeek = startOfWeek(currentWeekTop, { weekStartsOn: 1 }); // Start Monday

  // Function to place a class block on the grid
  const getClassBlockStyle = (startTime: string, endTime: string, dayOfWeek: number) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMin = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMin = parseInt(endTime.split(':')[1]);

    const startIdx = (startHour - 8) * 2 + (startMin === 30 ? 1 : 0);
    const durationBlocks = ((endHour - startHour) * 2) + ((endMin - startMin) / 30);

    return {
      gridRowStart: startIdx + 2, // +2 because header is row 1
      gridRowEnd: `span ${durationBlocks}`,
      gridColumnStart: dayOfWeek, // 1-indexed for Monday if we define so
    };
  };

  return (
    <div className="timetable-page">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Weekly Timetable</h2>
          <p className="text-muted">Manage and view your academic schedule</p>
        </div>
        <div className="flex gap-4">
          <div className="week-navigation">
            <button className="icon-btn"><ChevronLeft size={20} /></button>
            <span className="font-semibold">
              {format(startOfCurrentWeek, 'MMM dd')} - {format(addDays(startOfCurrentWeek, 5), 'MMM dd, yyyy')}
            </span>
            <button className="icon-btn"><ChevronRight size={20} /></button>
          </div>
          <button className="btn btn-outline"><Filter size={18} /> Filters</button>
        </div>
      </div>

      <div className="card timetable-wrapper">
        <div className="timetable-grid">
          {/* Time Column Header */}
          <div className="time-header-cell">Time</div>
          
          {/* Day Headers */}
          {DAYS.map((day, idx) => (
            <div key={day} className="day-header-cell">
              <span className="day-name">{day}</span>
              <span className="day-date">{format(addDays(startOfCurrentWeek, idx), 'dd')}</span>
            </div>
          ))}

          {/* Time Slots (bg grid) */}
          {Array.from({ length: 20 }).map((_, rIdx) => (
            <React.Fragment key={`row-${rIdx}`}>
              {rIdx % 2 === 0 ? (
                <div className="time-label-cell" style={{ gridRow: rIdx + 2, gridColumn: 1 }}>
                  {HOURS[rIdx / 2]}
                </div>
              ) : null}
              {DAYS.map((_, cIdx) => (
                <div 
                  key={`cell-${rIdx}-${cIdx}`} 
                  className={`grid-cell ${rIdx % 2 === 0 ? 'top-of-hour' : 'bottom-of-hour'}`}
                  style={{ gridRow: rIdx + 2, gridColumn: cIdx + 2 }}
                />
              ))}
            </React.Fragment>
          ))}

          {/* Class Blocks */}
          {classes.map(cls => (
            <div 
              key={cls._id} 
              className={`class-block type-${cls.type}`}
              style={getClassBlockStyle(cls.startTime, cls.endTime, cls.dayOfWeek + 1)} // Assuming Monday=1 in mock data? Let's assume dayOfWeek 1=Mon
            >
              <div className="class-title">CS301 - {cls.type}</div>
              <div className="class-time">{cls.startTime} - {cls.endTime}</div>
              <div className="class-room">{cls.roomId}</div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Timetable;
