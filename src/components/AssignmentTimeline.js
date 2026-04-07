import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../AssignmentTimeline.css';

const AssignmentTimeline = ({ assignments }) => {
  const navigate = useNavigate();
  
  const pendingAssignments = assignments.filter(a => a.status === 'Pending');

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUrgency = (days) => {
    if (days <= 1) return 'urgent';
    if (days <= 3) return 'due-soon';
    if (days <= 7) return 'upcoming';
    return 'plenty-time';
  };

  const getDay = (dueDate) => {
    return new Date(dueDate).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (dueDate) => {
    return new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="timeline">
      <h2 className="timeline-title">Pending Submissions</h2>
      <div className="timeline-container">
        {pendingAssignments.map(assignment => {
          const daysRemaining = getDaysRemaining(assignment.dueDate);
          const urgency = getUrgency(daysRemaining);
          
          return (
            <div key={assignment.id} className={`timeline-item ${urgency}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-date">
                    <div className="date-day">{getDay(assignment.dueDate)}</div>
                    <div className="date-num">{formatDate(assignment.dueDate)}</div>
                  </div>
                  <div className={`timeline-badge ${urgency}`}>
                    {daysRemaining <= 0 ? 'Overdue' : `${daysRemaining}d left`}
                  </div>
                </div>
                <h3>{assignment.title}</h3>
                <p>{assignment.description}</p>
                <button 
                  className={`btn-submit ${urgency === 'urgent' ? 'pulse' : ''}`}
                  onClick={() => navigate('/student/submit', { state: { assignment } })}
                >
                  Submit Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentTimeline;
