import React from 'react';
import '../AcademicCalendar.css';

const AcademicCalendar = () => {
  const events = [
    { id: 1, title: 'Semester Start', date: 'Jan 15, 2025', type: 'semester', icon: '🎓' },
    { id: 2, title: 'Mid-Term Exams', date: 'Mar 10-15, 2025', type: 'exam', icon: '📝' },
    { id: 3, title: 'Spring Break', date: 'Mar 25-29, 2025', type: 'holiday', icon: '🌴' },
    { id: 4, title: 'Final Exams', date: 'May 5-12, 2025', type: 'exam', icon: '📚' },
    { id: 5, title: 'Semester End', date: 'May 15, 2025', type: 'semester', icon: '🎉' },
    { id: 6, title: 'Summer Break', date: 'May 16 - Aug 20, 2025', type: 'holiday', icon: '☀️' }
  ];

  return (
    <div className="academic-calendar">
      <h2 className="ac-title">Academic Calendar</h2>
      <div className="ac-grid">
        {events.map(event => (
          <div key={event.id} className={`ac-card ${event.type}`}>
            <div className="ac-icon">{event.icon}</div>
            <div className="ac-content">
              <h3>{event.title}</h3>
              <p>{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicCalendar;
