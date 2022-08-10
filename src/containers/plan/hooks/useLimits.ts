import * as React from 'react';
import Konva from 'konva';
import planConfig from '../config/planConfig';
import PlanInstance from '../core/PlanInstance';
import { IComponentPlanProps, IMinMaxCoords } from '../interfaces/object';
import colors from '../../../styles/colors';

const limitId = 'limitRect';

export const useLimits = (props: IComponentPlanProps) => {
  const { limit } = props;
  const { items: { indent } } = planConfig();
  const instance = new PlanInstance(props);
  const { minMaxCoords, scale, layerLimit, height, width, offset } = instance;
  const [ limitCoords, setLimitCoords ] = React.useState<IMinMaxCoords>();

  const initLimits = React.useCallback(() => {
    const { maxCoord, minCoord } = minMaxCoords || {};
    const coords: IMinMaxCoords = {
      maxCoord: {
        x: maxCoord?.x + indent,
        y: maxCoord?.y + indent,
      },
      minCoord: {
        x: minCoord?.x + indent,
        y: minCoord?.y + indent,
      }
    }
    setLimitCoords(coords);
  }, [minMaxCoords, indent])

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
      id: `${limitId}_background`,
      x: 0,
      y: 0,
      width: (width ?? 0) + offset.x,
      height: (height ?? 0) + offset.y,
      fill: colors.black,
      opacity: 0.80,
      draggable: false,
    });

    const { maxCoord, minCoord } = limitCoords;
    const limitRect = new Konva.Rect({
      id: limitId,
      x: (minCoord.x) * scale,
      y: (minCoord.y) * scale,
      width: (maxCoord.x - minCoord.x - indent) * scale,
      height: (maxCoord.y - minCoord.y - indent) * scale,
      fill: colors.black,
      draggable: true,
      globalCompositeOperation: 'xor',
    });

    const updateLimitCoords = () => {
      const newMinCoord = {
        x: limitRect.x() / scale,
        y: limitRect.y() / scale,
      }
      const newMaxCoord = {
        x: newMinCoord.x + indent + limitRect.scaleX() * limitRect.width() / scale,
        y: newMinCoord.y + indent + limitRect.scaleY() * limitRect.height() / scale,
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
