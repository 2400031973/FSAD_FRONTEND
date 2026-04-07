import React from 'react';
import '../RecentlyAccessed.css';

const RecentlyAccessed = ({ assignments }) => {
  const recentAssignments = assignments.slice(0, 3);

  return (
    <div className="recently-accessed">
      <h2 className="ra-title">Recently Accessed</h2>
      <div className="ra-list">
        {recentAssignments.map(assignment => (
          <div key={assignment.id} className="ra-item">
            <div className="ra-info">
              <h3>{assignment.title}</h3>
              <p className="ra-status">
                <span className={`badge badge-${assignment.status.toLowerCase()}`}>
                  {assignment.status}
                </span>
              </p>
            </div>
            <div className="ra-date">{assignment.dueDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAccessed;
