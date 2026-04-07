import React from 'react';

const Card = ({ title, description, dueDate, status, actions }) => {
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge-pending';
      case 'submitted':
        return 'badge-submitted';
      case 'graded':
        return 'badge-graded';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="card">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {dueDate && <p><strong>Due:</strong> {dueDate}</p>}
      {status && <span className={`badge ${getBadgeClass(status)}`}>{status}</span>}
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
};

export default Card;
