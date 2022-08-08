import * as React from 'react';
import { ReactComponent as ArrowUp } from '../../assets/icons/arrow-up.svg';
import './PlanPages.css';

const pagesCls = 'plan-pages';

interface IProps {
  planName: string;
  count: string;
  onClickNext: React.MouseEventHandler;
  onClickPrev: React.MouseEventHandler;
}

const PlanPages: React.FC<IProps> = ({ planName, count, onClickNext, onClickPrev }) => {
  return (
    <div className={pagesCls}>
      <button className={`${pagesCls}_arrow-left`} onClick={onClickPrev}>
        <ArrowUp className={`${pagesCls}_arrow-icon`} />
      </button>
      <div className={`${pagesCls}_current`}>
        <div className={`${pagesCls}_name`}>
          {planName}
        </div>
        <div className={`${pagesCls}_count`}>
          {count}
        </div>
      </div>
      <button className={`${pagesCls}_arrow-right`} onClick={onClickNext}>
        <ArrowUp className={`${pagesCls}_arrow-icon`} />
      </button>
    </div>
  )
}

export default PlanPages;
