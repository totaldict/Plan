import * as React from 'react';
import { useMainStage } from '../../components/main-stage/useMainStage';
import { IPlanProps } from './interfaces/object';
import { ReactComponent as ArrowUp } from '../../assets/icons/arrow-up.svg';
import { ReactComponent as Limit } from '../../assets/icons/limit.svg';
import { useLimits } from '../../components/main-stage/useLimits';
import './Plan.css';

const planCls = 'plan';
const pagesCls = `${planCls}-pages`;
const limitCls = `${planCls}-limit`;

interface IProps {
  plans: IPlanProps[];
}

const Plan: React.FC<IProps> = ({ plans }): JSX.Element => {
  const [ currentPlanIdx, setCurrentPlanIdx ] = React.useState<number>(0);
  const [ container, setContainer ] = React.useState<HTMLDivElement | undefined>();
  const [ limit, setLimit ] = React.useState<boolean>(false);
  const currentProps = plans[currentPlanIdx];
  const numberOfPlans = plans?.length ?? 0;
  const { planName } = currentProps;

  const measuredRef = React.useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  const { setLimits, limitCoords } = useLimits({...currentProps, limit});
  const { createMainStage, renderPopups } = useMainStage({
    ...currentProps,
    container: container,
  });

  React.useEffect(() => {
    createMainStage(limitCoords);
    // document.body.addEventListener('keydown', listener);
  }, [container, createMainStage, currentPlanIdx, limitCoords])

  React.useEffect(() => {
    setLimits();
  }, [currentProps, limit, container, setLimits])

  const handleNextPlan = React.useCallback(() => {
    if (currentPlanIdx < numberOfPlans - 1) {
      setCurrentPlanIdx(currentPlanIdx + 1);
    }
  }, [currentPlanIdx, numberOfPlans])
 
  const handlePrevPlan = React.useCallback(() => {
    if (currentPlanIdx > 0) {
      setCurrentPlanIdx(currentPlanIdx - 1);
    }
  }, [currentPlanIdx]);

  const handleLimit = React.useCallback(() => {
    setLimit(!limit);
  }, [limit]);

  const count = React.useMemo(() => `${currentPlanIdx + 1}/${numberOfPlans}`, [currentPlanIdx, numberOfPlans]);
  // const listener = (event: KeyboardEvent) => {
  //   move(event?.key as keys);
  // }

  

  return (
    <div className={planCls}>
      <div className={`${planCls}-canvas`} tabIndex={-1} ref={measuredRef} />
      <button className={limitCls} onClick={handleLimit} >
        <Limit className={`${limitCls}_icon`} />
      </button>
      <div className={pagesCls}>
        <button className={`${pagesCls}_arrow-left`} onClick={handlePrevPlan}>
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
        <button className={`${pagesCls}_arrow-right`} onClick={handleNextPlan}>
          <ArrowUp className={`${pagesCls}_arrow-icon`} />
        </button>
      </div>
      {renderPopups()}
    </div>
  );
}

export default Plan;
