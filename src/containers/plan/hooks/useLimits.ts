import * as React from 'react';
import Konva from 'konva';
import planConfig from '../config/planConfig';
import PlanInstance from '../core/PlanInstance';
import { IComponentPlanProps, IMinMaxCoords } from '../interfaces/object';

const limitId = 'limitRect';

export const useLimits = (props: IComponentPlanProps) => {
  const { limit } = props;
  const { items: { indent } } = planConfig();
  const instance = new PlanInstance(props);
  const { minMaxCoords, scale, layerLimit } = instance;
  const [ limitCoords, setLimitCoords ] = React.useState<IMinMaxCoords>();

  const initLimits = React.useCallback(() => {
    setLimitCoords(minMaxCoords);
  }, [minMaxCoords])

  // React.useEffect(() => { //TODO Посмотреть, может этот эффект теперь не нужен
  //   if (!limitCoords) {
  //     initLimits()
  //   }
  // }, [initLimits, limit, limitCoords, minMaxCoords])

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

    const limitBackgroundRect = new Konva.Rect({
      id: 's123',
      x: 0,
      y: 0,
      width: 3000,
      height: 3000,
      fill: '#000000',
      opacity: 0.80,
      draggable: false,
    });

    const { maxCoord, minCoord } = limitCoords;
    const limitRect = new Konva.Rect({
      id: limitId,
      x: (minCoord.x + indent) * scale,
      y: (minCoord.y + indent) * scale,
      width: (maxCoord.x - minCoord.x - indent) * scale,
      height: (maxCoord.y - minCoord.y - indent) * scale,
      fill: '#000000',
      draggable: true,
      globalCompositeOperation: 'xor',
    });

    const updateLimitCoords = () => {
      // const newMinCoord = limitRect.position();
      const newMinCoord = {
        x: limitRect.x() / scale,
        y: limitRect.y() / scale,
      }
      const newMaxCoord = {
        x: newMinCoord.x + limitRect.scaleX() * limitRect.width() / scale,
        y: newMinCoord.y + limitRect.scaleY() * limitRect.height() / scale,
      }
      setLimitCoords({
        minCoord: newMinCoord,
        maxCoord: newMaxCoord,
      })
    }

    limitRect.on('transformend', function () {
      updateLimitCoords();
    });
    limitRect.on('dragend', function () {
      updateLimitCoords();
    });
    layerLimit.add(limitBackgroundRect);
    layerLimit.add(limitRect);

    const transformer = new Konva.Transformer({
      keepRatio: false,
      rotateEnabled: false,
    });
    transformer.nodes([limitRect]);
    layerLimit.add(transformer);
  }
  
  return {
    initLimits,
    setLimits,
    limitCoords,
  }
}
