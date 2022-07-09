import Konva from 'konva';
import * as React from 'react';
import { useMainStage } from '../../components/main-stage/useMainStage';
import { keys } from './interfaces/enums';
import { ICoords, IPlanProps } from './interfaces/object';
import './Plan.css';

const planCls = 'plan';

const Plan: React.FC<IPlanProps> = (props: IPlanProps) => {
  React.useEffect(() => {
    createMainStage();
    // document.body.addEventListener('keydown', listener);
  }, [])
  
  const { createMainStage } = useMainStage(props);

  // const listener = (event: KeyboardEvent) => {
  //   move(event?.key as keys);
  // }

  

  return (
    <div className={planCls} id={planCls}>
      {/* <canvas className={`${planCls}_canvas` } /> */}
    </div>
  )
}

export default Plan;
