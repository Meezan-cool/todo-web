import React from 'react';

interface TimeSlot {
  title: string;
  participants: string[];
  from: string;
  to: string;
}

interface CardProps {
  slot: TimeSlot;
  start: number;
  height: number;
}

const DynamicCard: React.FC<CardProps> = ({ slot, start, height }) => {
  return (
    <div className="card" style={{ top: `${start}%`, height: `${height}%` }}>
      <div className="card-title">{slot.title}</div>
      <div className="card-participants">
        {slot.participants.join(', ')}
      </div>
      <div className="card-time">
        {slot.from} - {slot.to}
      </div>
    </div>
  );
};

export default DynamicCard;
