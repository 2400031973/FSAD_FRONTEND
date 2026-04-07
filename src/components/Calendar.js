import React, { useState } from 'react';
import '../Calendar.css';

const Calendar = ({ assignments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');

  const getAssignmentForDate = (day, month = currentDate.getMonth()) => {
    const dateStr = `${currentDate.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return assignments.find(a => a.dueDate === dateStr);
  };

  const changeMonth = (delta) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + delta,
        1
      )
    );
  };

  const renderMonth = (monthOffset = 0) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });

    return (
      <div key={monthOffset} className="calendar-month">
        <div className="calendar-month-name">{monthName}</div>

        <div className="calendar-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="calendar-day-name">{day}</div>
          ))}

          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const assignment = getAssignmentForDate(day, month);

            const dateClass = assignment
              ? assignment.status === 'Submitted' || assignment.status === 'Graded'
                ? 'submitted'
                : 'due'
              : '';

            return (
              <div
                key={day}
                className={`calendar-day ${dateClass}`}
                onMouseEnter={() =>
                  assignment && setHoveredDate(`${monthOffset}-${day}`)
                }
                onMouseLeave={() => setHoveredDate(null)}
              >
                {day}

                {assignment && hoveredDate === `${monthOffset}-${day}` && (
                  <div className="tooltip">
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-title">{assignment.title}</div>
                    <div className="tooltip-status">{assignment.status}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          className="nav-btn"
          onClick={() =>
            viewMode === 'month'
              ? changeMonth(-1)
              : setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1))
          }
        >
          ‹
        </button>

        <div>
          <span className="calendar-title">
            {currentDate.getFullYear()}
          </span>

          <button
            className="view-toggle"
            onClick={() =>
              setViewMode(viewMode === 'month' ? 'year' : 'month')
            }
          >
            {viewMode === 'month' ? 'Year View' : 'Month View'}
          </button>
        </div>

        <button
          className="nav-btn"
          onClick={() =>
            viewMode === 'month'
              ? changeMonth(1)
              : setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1))
          }
        >
          ›
        </button>
      </div>

      <div className={`calendar-container ${viewMode}`}>
        {viewMode === 'month'
          ? renderMonth(0)
          : [...Array(12)].map((_, i) =>
              renderMonth(i - currentDate.getMonth())
            )}
      </div>
    </div>
  );
};

export default Calendar;
