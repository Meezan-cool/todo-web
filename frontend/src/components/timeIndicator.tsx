import { useEffect, useState } from 'react';
import moment from 'moment';

const TimeIndicator: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getTimePosition = (time: moment.Moment) => {
    const hours = time.hours();
    const minutes = time.minutes();
    return ((hours * 60 + minutes) * 100) / (12 * 60); // Percentage of the 12-hour day
  };

  const redLinePosition = getTimePosition(currentTime);

  return (
    <div className="time-indicator" style={{ top: `${redLinePosition}%` }}></div>
  );
};

export default TimeIndicator;
