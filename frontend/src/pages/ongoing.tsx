import React, { useState, useEffect, useRef } from 'react';
import moment, { Moment } from 'moment';
import '../styles/sheets/ongoing.scss';
import MonthNavigation from '../components/MonthNav';

interface Task {
  id: number | string;
  title: string;
  start: string;
  end: string;
  date: string;
  className?: string;
}

const OnGoing: React.FC = () => {
  const currentYear = moment().year();
  const today = moment();
  const [currentMonth, setCurrentMonth] = useState<Moment>(moment().year(currentYear));
  const [activeDate, setActiveDate] = useState<number | null>(today.date());
  const [currentTime, setCurrentTime] = useState<Moment>(moment());
  const datesContainerRef = useRef<HTMLDivElement | null>(null);
  const activeDateRef = useRef<HTMLDivElement | null>(null);
  const ongoingDateBoxRef = useRef<HTMLDivElement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Sample tasks data
  const tasks: Task[] = [
    { id: 1, title: 'Add Smooth Dragging Functionality in Popup', start: '05:00', end: '07:00', date: '17 July' },
    { id: 2, title: 'Dragging Functionality', start: '15:00', end: '20:10', date: '19 July' },
    { id: 3, title: 'Testing Of Master Todo', start: '1:00', end: '3:10', date: '20 July' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getTimePosition = (time: Moment): number => {
    const hours = time.hours();
    const minutes = time.minutes();
    return ((hours * 60 + minutes) * 100) / (24 * 60);
  };

  const getTaskPosition = (start: string, end: string, className?: string): { top: number; height: number } => {
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    const startPosition = getTimePosition(startTime);
    const endPosition = getTimePosition(endTime);

    let top = startPosition;
    let height = endPosition - startPosition;

    if (className === 'split-last') {
      top -= (20 / 1440) * 100;
      height += (20 / 1440) * 100;
    }

    return {
      top,
      height,
    };
  };

  const splitTasksOverMidnight = (tasks: Task[]): Task[] => {
    const splitTasks: Task[] = [];
    tasks.forEach((task) => {
      const taskDate = moment(task.date, 'D MMM');
      const startTime = moment(task.start, 'HH:mm');
      const endTime = moment(task.end, 'HH:mm');

      if (endTime.isBefore(startTime)) {
        // Split the task into two tasks
        splitTasks.push({
          ...task,
          end: '23:59',
          className: 'split-first',
        });
        splitTasks.push({
          ...task,
          id: `${task.id}-split`,
          date: taskDate.clone().add(1, 'day').format('D MMM'),
          start: '00:00',
          className: 'split-last',
        });
      } else {
        splitTasks.push(task);
      }
    });
    return splitTasks;
  };

  const redLinePosition = getTimePosition(currentTime);

  useEffect(() => {
    if (datesContainerRef.current && activeDateRef.current && activeDate !== null) {
      const itemOffset = activeDateRef.current.offsetLeft;
      const dateCardWidth = activeDateRef.current.offsetWidth;
      datesContainerRef.current.scrollLeft = itemOffset - dateCardWidth;
    }
  }, [activeDate]);

  useEffect(() => {
    if (activeDate !== null && ongoingDateBoxRef.current) {
      const activeDateMoment = moment().date(activeDate).month(currentMonth.month());
      const todayMoment = moment();
      if (activeDateMoment.isSame(todayMoment, 'day') && redLinePosition > 20) {
        ongoingDateBoxRef.current.scrollTop = redLinePosition * 13;
      } else {
        ongoingDateBoxRef.current.scrollTop = 0;
      }
    }
  }, [activeDate, redLinePosition, currentMonth]);

  const prevMonth = (): void => {
    const newMonth = currentMonth.clone().subtract(1, 'month');
    setCurrentMonth(newMonth);
    setActiveDate(null);
  };

  const nextMonth = (): void => {
    const newMonth = currentMonth.clone().add(1, 'month');
    setCurrentMonth(newMonth);
    setActiveDate(null); // Reset active date when changing month
  };

  const getDatesOfMonth = (month: Moment): Moment[] => {
    const daysInMonth = month.daysInMonth();
    const dates: Moment[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(month.clone().date(i));
    }
    return dates;
  };

  const handleDateClick = (date: Moment): void => {
    if (date.month() === currentMonth.month()) {
      setActiveDate(date.date()); // Set active date only if the date is within the current month
    }
  };

  const datesOfMonth = getDatesOfMonth(currentMonth);

  const hours = Array.from({ length: 24 }, (_, i) => i); // Create an array of hours from 0 to 23

  const allTasks = splitTasksOverMidnight(tasks);
  const filteredTasks = allTasks.filter((task) => {
    const taskDate = moment(task.date, 'D MMM');
    return taskDate.date() === activeDate && taskDate.month() === currentMonth.month();
  });

  const checkTaskExists = (hour: number): boolean => {
    return filteredTasks.some((task) => {
      const startHour = moment(task.start, 'HH:mm').hours();
      const endHour = moment(task.end, 'HH:mm').hours();
      return startHour <= hour && hour < endHour;
    });
  };

  const handleTimelineClick = (hour: number): void => {
    const currentTime = moment();
    const clickedDateTime = moment()
      .date(activeDate as number)
      .month(currentMonth.month())
      .hour(hour)
      .minute(0);
  
    const currentDateNow = moment().date(); 
    const formatHour = moment().hour(hour).minute(0).second(0);
    const currentTimeMinute = moment().format('HH:mm:ss');
  
    const getFormattedTime = (time: moment.Moment, minutesToAdd: number): string => {
      return time.clone().add(minutesToAdd, 'minutes').format('h:mm A');
    };
  
    if (currentTime.hour() === hour) {
      const taskEndsAtCurrentHour = filteredTasks.some(task => {
        const endHour = moment(task.end, 'HH:mm').hour();
        return endHour === hour;
      });
  
      let startTime: string;
      if (taskEndsAtCurrentHour) {
        const additionalMinutes = filteredTasks
          .filter(task => moment(task.end, 'HH:mm').hour() === hour)
          .reduce((total, task) => total + moment(task.end, 'HH:mm').minute(), 0);
  
        startTime = getFormattedTime(currentTime, additionalMinutes + 15);
      } else if (activeDate === currentDateNow) {
        startTime = getFormattedTime(formatHour, moment(currentTimeMinute, 'HH:mm:ss').minutes() + 15);
      } else if (activeDate < currentDateNow) {
        setToastMessage('Cannot schedule tasks in the past.');
        setTimeout(() => setToastMessage(''), 3000);
        return;
      } else {
        startTime = formatHour.format('h:mm A');
      }
  
      setPopupContent(startTime);
      setIsPopupVisible(true);
      return; // Return early to prevent further actions
    }
  
    // Check if clickedDateTime is in the past or before today
    if (clickedDateTime.isBefore(currentTime) || clickedDateTime.isBefore(today, 'day')) {
      setToastMessage('Cannot schedule tasks in the past.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
  
    // Check if a task already exists in the time slot
    if (checkTaskExists(hour)) {
      setToastMessage('A task is already pending in this time slot.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
  
    // If none of the above conditions matched, simply set the start time
    const startTime = formatHour.format('h:mm A');
    setPopupContent(startTime);
    setIsPopupVisible(true);
  };

  return (
    <div className="ongoing">
      <MonthNavigation
        currentMonth={currentMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

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
              <div key={hour} className="timeline-hour" onClick={() => handleTimelineClick(hour)}>
                <span>{moment({ hour }).format('hh A')}</span>
              </div>
            ))}
            {activeDate === today.date() && currentMonth.isSame(today, 'month') && (
              <div className="time-indicator" style={{ top: `${redLinePosition}%` }}>
                <div className="circle-indicator" title={currentTime.format('h:mm A')}></div>
              </div>
            )}
            {filteredTasks.map((task) => {
              const taskPosition = getTaskPosition(task.start, task.end, task.className);
              return (
                <div
                  key={task.id}
                  className={`task-card ${task.className || ''}`}
                  style={{
                    top: `${taskPosition.top}%`,
                    height: `${taskPosition.height}%`,
                  }}
                >
                  <div className="task-title-box">{task.title}</div>
                  <div className="time-box">{`${moment(task.start, 'HH:mm').format('h:mm A')} - ${moment(task.end, 'HH:mm').format('h:mm A')}`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`popup ${isPopupVisible ? 'show' : ''}`}>
        <div className="popup-header">
          <div className="fe-box" onClick={() => setIsPopupVisible(false)}>Cancel</div>
          <div className="main-box">New Task</div>
          <div className="fe-box">Done</div>
        </div>
        <div className="task-form-box">
          <div className="input-box">
            <div className="label-box">Title</div>
            <input type="text" placeholder='Enter Task Title'/>
          </div>
          <div className="input-box">
            <div className="label-box">Description</div>
            <textarea  placeholder='Enter Task Title'/>
          </div>
        </div>
          {popupContent}{activeDate}
      </div>
      <div className={`toast ${toastMessage?'showtoast':''}`}>{toastMessage}</div>
    </div>
  );
};

export default OnGoing;
