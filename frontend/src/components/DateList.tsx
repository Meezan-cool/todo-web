import React from 'react';
import moment from 'moment';

interface DateListProps {
  datesOfMonth: moment.Moment[];
  activeDate: number | null;
  onDateClick: (date: moment.Moment) => void;
}

const DateList: React.FC<DateListProps> = ({ datesOfMonth, activeDate, onDateClick }) => {
  return (
    <div className="date-box">
      {datesOfMonth.map((date) => (
        <div
          key={date.format('YYYY-MM-DD')}
          className={`date-item ${date.date() === activeDate ? 'active' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <div className="date-show">
            {date.date()} <span>{date.format('ddd')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateList;
