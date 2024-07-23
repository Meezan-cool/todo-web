import React, { useState, useEffect, useRef } from 'react';
import moment, { Moment } from 'moment';
import '../styles/sheets/ongoing.scss';
import MonthNavigation from '../components/MonthNav';
import {Icon} from '@iconify/react'
type Priority = 'low' | 'medium' | 'high';
interface Task {
  id: number | string;
  title: string;
  description: string;
  priority: string;
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
  // const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  // const [popupContent, setPopupContent] = useState<string>('');
  // const [toastMessage, setToastMessage] = useState<string>('');
  // const [selectedDate, setSelectedDate] = useState<Moment>(today);
  // const [estimatedTime, setEstimatedTime] = useState<number>(3);
  // const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);
  // const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState<boolean>(false);
  // const [priority, setPriority] = useState({ name: 'low'});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());
  const [estimatedTime, setEstimatedTime] = useState(3);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [priority, setPriority] = useState<Priority>('low');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  // const dateDropdownRef = useRef<HTMLDivElement>(null);
  // const timeDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);
  
  const calculateSizeInMB = (data: string): number => {
    // Convert to JSON string if not already
    const jsonString = JSON.stringify(data);
    // Calculate byte length
    const byteLength = new Blob([jsonString]).size;
    // Convert bytes to MB
    return byteLength / (1024 * 1024);
  };

  const storeDataInLocalStorage = (key: string, data: string) => {
    const maxStorageMB = 4; // Maximum allowed storage in MB
    // const maxStorageBytes = maxStorageMB * 1024 * 1024; // Convert MB to bytes
  
    // Calculate size of data to store
    const dataSize = calculateSizeInMB(data);
  
    if (dataSize > maxStorageMB) {
      console.warn('Data size exceeds the limit of 4MB.');
      return;
    }
  
    try {
      localStorage.setItem(key, data);
      console.log('Data stored successfully.');
      // Check remaining space
      checkRemainingLocalStorageSpace();
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };
  
  const checkRemainingLocalStorageSpace = () => {
    // const totalBytes = localStorage.length;
    // const freeBytes = (5 * 1024 * 1024) - totalBytes; // Assuming 5MB total storage
    // console.log(`Remaining local storage space: ${(freeBytes / (1024 * 1024)).toFixed(2)} MB`);
  };
  
  

  const handleTabChange = (tab: Priority) => {
    setPriority(tab);
  };
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
      setIsDateDropdownOpen(false);
    }
    if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
      setIsTimeDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample tasks data
  // const tasks: Task[] = [
  //   { id: 1, title: 'Add Smooth Dragging Functionality in Popup', start: '05:00', end: '07:00', date: '17 July' },
  //   { id: 2, title: 'Dragging Functionality', start: '15:00', end: '20:10', date: '19 July' },
  //   { id: 3, title: 'Testing Of Master Todo', start: '1:00', end: '3:10', date: '20 July' },
  //   { id: 4, title: 'Todo', start: '1:00', end: '3:00', date: '21 July' },
  //   { id: 5, title: 'Appointment Updates', start: '2:00', end: '5:00', date: '22 July' },
  // ];

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
          end: '24:00',
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
  // console.log(popupContent)
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
    return time.clone().add(minutesToAdd, 'minutes').format('HH:mm:ss');
  };

  if (currentTime.hour() === hour) {
    const taskEndsAtCurrentHour = filteredTasks.some(task => {
      const endHour = moment(task.end, 'HH:mm').hour();
      return endHour === hour;
    });

    let startTime: string;
    if (checkTaskExists(hour)) {
      displayToastMessage('A task is already pending in this time slot.');
      return;
    } else if (taskEndsAtCurrentHour) {
      const additionalMinutes = filteredTasks
        .filter(task => moment(task.end, 'HH:mm').hour() === hour)
        .reduce((total, task) => total + moment(task.end, 'HH:mm').minute(), 0);

      startTime = getFormattedTime(currentTime, additionalMinutes + 15);
    } else if (activeDate === currentDateNow) {
      startTime = getFormattedTime(formatHour, moment(currentTimeMinute, 'HH:mm:ss').minutes() + 15);
    } else if (activeDate !== null && activeDate < currentDateNow) {
      displayToastMessage('Cannot schedule tasks in the past.');
      return;
    } else {
      startTime = formatHour.format('HH:mm:ss');
    }
   console.log(startTime)
    setPopupContent(startTime);
    setIsPopupVisible(true);
    return; // Return early to prevent further actions
  }

  // Check if clickedDateTime is in the past or before today
  if (clickedDateTime.isBefore(currentTime) || clickedDateTime.isBefore(moment(), 'day')) {
    displayToastMessage('Cannot schedule tasks in the past.');
    return;
  }

  // Check if a task already exists in the time slot
  if (checkTaskExists(hour)) {
    displayToastMessage('A task is already pending in this time slot.');
    return;
  }

  // If none of the above conditions matched, simply set the start time
  const startTime = formatHour.format('H:mm');
  setPopupContent(startTime);
  setIsPopupVisible(true);

   // Store data when setting popup content
   storeDataInLocalStorage('popupContent', startTime);
};

useEffect(() => {
  checkRemainingLocalStorageSpace();
}, []);


// Function to display the toast message
function displayToastMessage(message: string): void {
  setToastMessage(message);
  setTimeout(() => setToastMessage(''), 3000);
}


  const generateUpcomingDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      dates.push(today.clone().add(i, 'days'));
    }
    return dates;
  };

  const dateOptions = generateUpcomingDates();

  const handleSubmitTask = () => {
    const startTime = moment(popupContent,'H:mm'); 
    const endTime = startTime.clone().add(estimatedTime, 'hours').format('H:mm');
  console.log(endTime)
    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      description: newTaskDescription,
      date: selectedDate.format('D MMM'),  // Ensure the date is formatted correctly
      start: popupContent,  // Format startTime as needed
      end: endTime,
      priority,
    };
    console.log(newTask)
  
    const tempTasks = [...tasks, newTask];
    setTasks(tempTasks);
    localStorage.setItem('tasks', JSON.stringify(tempTasks));
  
    setIsPopupVisible(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };
  

  // const dateOptions = Array.from({ length: 31 }, (_, i) => moment().date(i + 1));

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
                  <div className="task-description-box">{task.description}</div>
                  <div className="task-description-box">{task.priority}</div>
                  <div className="time-box">{`${moment(task.start, 'HH:mm').format('h:mm A')} - ${moment(task.end, 'HH:mm').format('h:mm A')}`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`popup-overlay ${isPopupVisible ? 'show-over' : ''}`}></div>
      <div className={`popup ${isPopupVisible ? 'show' : ''}`}>
      <div className="popup-header">
        <div className="fe-box" onClick={() => setIsPopupVisible(false)}>Cancel</div>
        <div className="main-box">New Task</div>
        <div className="fe-box" onClick={handleSubmitTask}>Done</div>
      </div>
      <div className="task-form-box">
        <div className="input-box">
          {popupContent}
          <div className="label-box">Title</div>
          <input
            type="text"
            placeholder="Enter Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
        </div>
        <div className="input-box">
          <div className="label-box">Description</div>
          <textarea
            placeholder="Enter Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
        </div>

        <div className="db-input-box">
          <div className="input-box">
            <div className="label-box">Date</div>
            <div className="custom-dropdown" ref={dateDropdownRef}>
              <div
                className={`selected-option ${isDateDropdownOpen ? 'bora' : ''}`}
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              >
                {selectedDate.format('D MMM')} <Icon icon="uim:calender" className="icon-opt" />
              </div>
              <div className={`dropdown-options ${isDateDropdownOpen ? 'enlarge' : ''}`}>
                <div className="dropdown-option gapped-top"></div>
                {dateOptions.map((date, index) => (
                  <div
                    key={index}
                    className={`dropdown-option ${selectedDate.isSame(date, 'day') ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsDateDropdownOpen(false);
                    }}
                  >
                    {date.format('D MMM')}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="input-box">
            <div className="label-box">Estimated Time</div>
            <div className="custom-dropdown" ref={timeDropdownRef}>
              <div
                className={`selected-option ${isTimeDropdownOpen ? 'bora' : ''}`}
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              >
                {estimatedTime}h <Icon icon="uim:clock" className="icon-opt" />
              </div>
              <div className={`dropdown-options ${isTimeDropdownOpen ? 'enlarge' : ''}`}>
                <div className="dropdown-option gapped-top"></div>
                {Array.from({ length: 6 }, (_, i) => i + 2).map((hours) => (
                  <div
                    key={hours}
                    className={`dropdown-option ${estimatedTime === hours ? 'active' : ''}`}
                    onClick={() => {
                      setEstimatedTime(hours);
                      setIsTimeDropdownOpen(false);
                    }}
                  >
                    {hours} hours
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="input-box">
          <div className="label-box">Priority</div>
          <div className="tab-container">
            {['low', 'medium', 'high'].map((tab) => (
              <div
                key={tab}
                className={`tab ${priority === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab as Priority)}
              >
                <div
                  className={`priority-decor-tab ${priority === tab ? 'active' : ''} ${priority === 'low' ? 'low' : ''} ${priority === 'medium' ? 'medium' : ''} ${priority === 'high' ? 'high' : ''}`}
                ></div>
                {tab}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      <div className={`toast ${toastMessage ? 'showtoast' : ''}`}>{toastMessage}</div>
    </div>
  );
};

export default OnGoing;
