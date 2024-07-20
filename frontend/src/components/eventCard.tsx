import React from 'react';

interface EventCardProps {
  title: string;
  participants: string[];
  from: string;
  to: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, participants, from, to }) => {
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{from} - {to}</p>
      <div className="participants">
        {participants.map((participant, index) => (
          <span key={index}>{participant}</span>
        ))}
      </div>
    </div>
  );
};

export default EventCard;
