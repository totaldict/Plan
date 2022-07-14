import Konva from 'konva';
import * as React from 'react';
import { useMainStage } from '../../components/main-stage/useMainStage';
import { keys } from './interfaces/enums';
import { IComponentPlanProps, ICoords, IPlanProps, Size } from './interfaces/object';
import './Plan.css';

const planCls = 'plan';

const Plan: React.FC<IPlanProps> = (props: React.PropsWithChildren<IPlanProps>): JSX.Element => {
  const planDivRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    // if (!planDivRef?.current) {
    //   return undefined;
    // }
    createMainStage();
    // document.body.addEventListener('keydown', listener);
  }, [planDivRef?.current])
  const { createMainStage } = useMainStage({
    ...props,
    container: planDivRef?.current as HTMLDivElement,
  });

  // console.log('props', props)
  // const listener = (event: KeyboardEvent) => {
  //   move(event?.key as keys);
  // }
  return (
    <div className={planCls}>
      <div className="plan-canvas" tabIndex={-1} ref={planDivRef} />
    </div>
  );
}

export default Plan;
