import React from 'react';
import { Icon } from '@iconify/react';
import moment from 'moment';

interface MonthNavigationProps {
  currentMonth: moment.Moment;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({ currentMonth, onPrevMonth, onNextMonth }) => {
  return (
    <div className="month-box">
      {currentMonth.month() > 0 && (
        <div className="month-btn prev" onClick={onPrevMonth}>
          <Icon icon="solar:arrow-down-broken" className="sl-icon" />
          {currentMonth.clone().subtract(1, 'month').format('MMM')}
        </div>
      )}
      <div className="curr-month">{currentMonth.format('MMMM')}</div>
      {currentMonth.month() < 11 && (
        <div className="month-btn next" onClick={onNextMonth}>
          {currentMonth.clone().add(1, 'month').format('MMM')}
          <Icon icon="solar:arrow-down-broken" className="sl-icon" />
        </div>
      )}
    </div>
  );
};

export default MonthNavigation;
