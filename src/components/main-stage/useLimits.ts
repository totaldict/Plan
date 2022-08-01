import * as React from 'react';
import Konva from 'konva';
import planConfig from '../../containers/plan/config/planConfig';
import PlanInstance from '../../containers/plan/core/PlanInstance';
import { IComponentPlanProps, IMinMaxCoords } from '../../containers/plan/interfaces/object';

const limitId = 'limitRect';

export const useLimits = (props: IComponentPlanProps) => {
  const { limit } = props;
  
  const { items: { indent } } = planConfig();
  const instance = new PlanInstance(props);
  const { minMaxCoords, scale, layerLimit } = instance;
  const [ limitCoords, setLimitCoords ] = React.useState<IMinMaxCoords>();

  React.useEffect(() => {
    if (!limitCoords) {
      setLimitCoords(minMaxCoords);
    }
  }, [limit])

  const setLimits = () => {
    if (!limit) {
      layerLimit?.destroyChildren();
      return;
    }
    if (!limitCoords) {
      return;
    }
    if (layerLimit.find(`#${limitId}`).length > 0) {
      return;
    }
    const { maxCoord, minCoord } = limitCoords;
    const limitRect = new Konva.Rect({
      id: limitId,
      x: (minCoord.x + indent) * scale,
      y: (minCoord.y + indent) * scale,
      width: (maxCoord.x - minCoord.x - indent) * scale,
      height: (maxCoord.y - minCoord.y - indent) * scale,
      stroke: 'black',
      draggable: true,
    });
    limitRect.on('transformend', function () {
      const newMinCoord = limitRect.position();
      const newMaxCoord = {
        x: newMinCoord.x + limitRect.scaleX() * limitRect.width(),
        y: newMinCoord.y + limitRect.scaleY() * limitRect.height(),
      }
      setLimitCoords({
        minCoord: newMinCoord,
        maxCoord: newMaxCoord,
      })
    });
    limitRect.on('dragend', function () {
      console.log('сделать на dragend установку координат');
    });

    layerLimit.add(limitRect);

    const transformer = new Konva.Transformer({
      keepRatio: false,
    });
    transformer.nodes([limitRect]);
    layerLimit.add(transformer);  //TODO сделать отдельный слой, он должен лежать ниже маркеров
  }
  
  return {
    setLimits,
    limitCoords,
  }
}
