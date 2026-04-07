import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AcademicCalendar from '../components/AcademicCalendar';

const AcademicCalendarPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" userName={user.name} />
      <div className="main-content">
        <Header title="Academic Calendar" />
        <div className="content">
          <AcademicCalendar />
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendarPage;
