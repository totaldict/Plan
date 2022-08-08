import * as React from 'react';
import Popup from 'reactjs-popup';
import { ReactComponent as Limit } from '../../assets/icons/limit.svg';
import './LimitButton.css';

const limitCls = 'limit-button';

interface IProps {
  onClick: React.MouseEventHandler;
}

const LimitButton: React.FC<IProps> = ({ onClick }) => {
  return (
    <Popup
      trigger={
        <button className={limitCls} onClick={onClick} >
          <Limit className={`${limitCls}_icon`} />
        </button>
      }
      on={['hover', 'focus']}
      position={['top left', 'top center']}
    >
      <span className={`${limitCls}_tooltip`}>Ограничение области</span>
    </Popup>
  )
}

export default LimitButton;
