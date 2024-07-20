import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import '../styles/sheets/ongoing.scss';
import { Icon } from '@iconify/react';

const OnGoing: React.FC = () => {
  const currentYear = moment().year();
  const today = moment();
  const [currentMonth, setCurrentMonth] = useState(moment().year(currentYear));
  const [activeDate, setActiveDate] = useState<number | null>(today.date());
  const [currentTime, setCurrentTime] = useState(moment());

  const datesContainerRef = useRef<HTMLDivElement | null>(null);
  const activeDateRef = useRef<HTMLDivElement | null>(null);
  const ongoingDateBoxRef = useRef<HTMLDivElement | null>(null);

  // Sample tasks data
  const tasks = [
    { id: 1, title: 'Mobile App Design', start: '09:00', end: '11:00', date: '14 july' },
    { id: 2, title: 'Web Development', start: '14:00', end: '15:30', date: '14 july' },
    { id: 3, title: 'API Testing', start: '16:00', end: '18:30', date: '14 july' },
    { id: 4, title: 'Task Management', start: '19:00', end: '21:30', date: '14 july' },
    { id: 5, title: 'Task Management', start: '19:00', end: '21:30', date: '15 july' },
    { id: 6, title: 'Attain Meeting With Maroof', start: '01:00', end: '04:30', date: '15 july' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 60000); 

    return () => clearInterval(timer);
  }, []);

  const getTimePosition = (time: moment.Moment) => {
    const hours = time.hours();
    const minutes = time.minutes();
    return ((hours * 60 + minutes) * 100) / (24 * 60); // Percentage of the day
  };

  const getTaskPosition = (start: string, end: string) => {
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    const startPosition = getTimePosition(startTime);
    const endPosition = getTimePosition(endTime);
    return {
      top: startPosition,
      height: endPosition - startPosition,
    };
  };

  const redLinePosition = getTimePosition(currentTime);

  useEffect(() => {
    if (datesContainerRef.current && activeDateRef.current && activeDate !== null) {
      const itemOffset = activeDateRef.current.offsetLeft;
      datesContainerRef.current.scrollLeft = itemOffset;
    }
  }, [activeDate]);

  useEffect(() => {
    if (ongoingDateBoxRef.current) {
      const containerHeight = ongoingDateBoxRef.current.offsetHeight;
      const scrollPosition = (redLinePosition / 100) * containerHeight - 100;
      ongoingDateBoxRef.current.scrollTop = redLinePosition * 13;
      console.log(scrollPosition > 0 ? scrollPosition * 5 : 0);
    }
  }, [currentTime, redLinePosition]);

  const prevMonth = () => {
    const newMonth = currentMonth.clone().subtract(1, 'month');
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = currentMonth.clone().add(1, 'month');
    setCurrentMonth(newMonth);
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

  const hours = Array.from({ length: 24 }, (_, i) => i); // Create an array of hours from 0 to 23

  const filteredTasks = tasks.filter((task) => {
    const taskDate = moment(task.date, 'D MMM');
    return taskDate.date() === activeDate && taskDate.month() === currentMonth.month();
  });

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

      <div className="ongoing-box">
        <div className="title-box">Ongoing</div>
        <div className="ongoing-date-box" ref={ongoingDateBoxRef}>
          <div className="timeline">
            {hours.map((hour) => (
              <div key={hour} className="timeline-hour">
                <span>{moment({ hour }).format('hh A')}</span>
              </div>
            ))}
            <div
              className="time-indicator"
              style={{ top: `${redLinePosition}%` }}
            >
              <div className="circle-indicator" title={currentTime.format('h:mm A')}></div>
            </div>
            {filteredTasks.map((task) => {
              const taskPosition = getTaskPosition(task.start, task.end);
              return (
                <div
                  key={task.id}
                  className="task-card"
                  style={{ top: `${taskPosition.top}%`, height: `${taskPosition.height}%` }}
                  title={`${task.start} - ${task.end}`}
                >
                  <div className="task-title-box">{task.title}</div>
                  <div className="time-box">{`${moment(task.start,'hh:mm A').format('h:mm A')} - ${moment(task.end,'hh:mm A').format('h:mm A')}`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnGoing;
