import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import '../styles/sheets/ongoing.scss';
import { Icon } from '@iconify/react';

const OnGoing: React.FC = () => {
  const currentYear = moment().year();
  const today = moment();
  const [currentMonth, setCurrentMonth] = useState(moment().year(currentYear));
  // const [currentDate, setCurrentDate] = useState<number>(today.date()); // Initialize with current date
  const [activeDate, setActiveDate] = useState<number | null>(today.date()); // Store active date separately
  const datesContainerRef = useRef<HTMLDivElement | null>(null);
  const activeDateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (datesContainerRef.current && activeDateRef.current && activeDate !== null) {
      const itemOffset = activeDateRef.current.offsetLeft;
      datesContainerRef.current.scrollLeft = itemOffset;
    }
  }, [activeDate]);

  const prevMonth = () => {
    const newMonth = currentMonth.clone().subtract(1, 'month');
    setCurrentMonth(newMonth);
    // Do not change activeDate when switching months
  };

  const nextMonth = () => {
    const newMonth = currentMonth.clone().add(1, 'month');
    setCurrentMonth(newMonth);
    // Do not change activeDate when switching months
  };

  const getDatesOfMonth = (month: moment.Moment) => {
    const daysInMonth = month.daysInMonth();
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(month.clone().date(i));
    }
    return dates;
  };

  const handleDateClick = (date: moment.Moment) => {
    if (date.month() === currentMonth.month()) {
      setActiveDate(date.date()); // Set active date only if the date is within the current month
    }
  };

  const datesOfMonth = getDatesOfMonth(currentMonth);

  return (
    <div className="ongoing">
      <div className="month-box">
        {currentMonth.month() > 0 && (
          <div className="month-btn prev" onClick={prevMonth}>
            <Icon icon="solar:arrow-down-broken" className="sl-icon" />
            {currentMonth.clone().subtract(1, 'month').format('MMM')}
          </div>
        )}
        <div className="curr-month">{currentMonth.format('MMMM')}</div>
        {currentMonth.month() < 11 && (
          <div className="month-btn next" onClick={nextMonth}>
            {currentMonth.clone().add(1, 'month').format('MMM')}
            <Icon icon="solar:arrow-down-broken" className="sl-icon" />
          </div>
        )}
      </div>

      <div className="date-box" ref={datesContainerRef}>
        {datesOfMonth.map((date) => (
          <div
            key={date.date()}
            className={`date-item ${date.date() === activeDate ? 'active' : ''}`}
            onClick={() => handleDateClick(date)}
            ref={date.date() === activeDate ? activeDateRef : null}
          >
            <div className="date-show">
              {date.date()} <span>{date.format('ddd')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnGoing;
