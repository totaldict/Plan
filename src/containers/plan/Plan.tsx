import * as React from 'react';
import { useMainStage } from './hooks/useMainStage';
import { IPlanProps } from './interfaces/object';
import { useLimits } from './hooks/useLimits';
import LimitButton from '../../components/LimitButton/LimitButton';
import PlanPages from '../../components/PlanPages/PlanPages';
import './Plan.css';

const planCls = 'plan';

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

  const { initLimits, setLimits, limitCoords } = useLimits({...currentProps, limit});
  const { createMainStage, renderPopups } = useMainStage({
    ...currentProps,
    container: container,
  });

  React.useEffect(() => {
    createMainStage(limitCoords);
  }, [container, createMainStage, limitCoords])

  React.useEffect(() => {
    initLimits();
  }, [currentPlanIdx, initLimits])

  React.useEffect(() => {
    setLimits();
  }, [currentProps, limit, container, setLimits, currentPlanIdx])

  const handleNextPlan = React.useCallback(() => {
    if (currentPlanIdx < numberOfPlans - 1) {
      setCurrentPlanIdx(currentPlanIdx + 1);
      setLimit(false);
    }
  }, [currentPlanIdx, numberOfPlans])
 
  const handlePrevPlan = React.useCallback(() => {
    if (currentPlanIdx > 0) {
      setCurrentPlanIdx(currentPlanIdx - 1);
      setLimit(false);
    }
  }, [currentPlanIdx]);

  const handleLimit = React.useCallback(() => {
    setLimit(!limit);
  }, [limit]);

  const count = React.useMemo(() => `${currentPlanIdx + 1}/${numberOfPlans}`, [currentPlanIdx, numberOfPlans]);

  return (
    <div className={planCls}>
      <div className={`${planCls}-canvas`} tabIndex={-1} ref={measuredRef} />
      <LimitButton onClick={handleLimit} />
      <PlanPages planName={planName} count={count} onClickNext={handleNextPlan} onClickPrev={handlePrevPlan} />
      {renderPopups()}
    </div>
  );
}

export default Plan;
