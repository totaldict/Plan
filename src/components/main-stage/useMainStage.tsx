import * as React from 'react';
import Konva from 'konva';
import { NodeConfig } from 'konva/lib/Node';
import { RectConfig } from 'konva/lib/shapes/Rect';
import PlanInstance from '../../containers/plan/core/PlanInstance';
import { blockWidth, deltaMove, numberBlocksInHeight, numberBlocksInWidth, stageBegin } from '../../containers/plan/interfaces/constants';
import { keys, objectType } from '../../containers/plan/interfaces/enums';
import colors from '../../styles/colors';
import { isEven } from '../../containers/plan/core/utils';
import { IObject, IPlanProps } from '../../containers/plan/interfaces/object';
import useImage from 'use-image';
import { Image } from "react-konva";
import Violation from '../../assets/icons/Violation.svg';

export const useMainStage = (props: IPlanProps) => {
  // const { x: beginX, y: beginY } = stageBegin;
  // const battlefielWidth = numberBlocksInWidth * blockWidth;
  // const battlefielHeight = numberBlocksInHeight * blockWidth;
  const { planId, markers, planName, planUrl} = props;
  const [image] = useImage('/icons/Violation.svg', "anonymous");
  // console.log('image', image)
  
  const createMainStage = () => {
    const instance = new PlanInstance(props);
    const { layerPlan, layerMarkers, stage, objects = [] } = instance;
    
    Konva.Image.fromURL('/mock/plan-1.jpg', (imageNode: Konva.Image) => {
      imageNode.setAttrs({
        scaleX: 1,
        scaleY: 1,
      });
      layerPlan.add(imageNode);
    });

    markers?.forEach(({ x, y }, idx) => {
      // Рисуем маркер
      const marker = new Konva.Shape({
        id: `${idx}-marker`,
        x: x,
        y: y,
        fill: '#00D2FF',
        stroke: '#FFFFFF',
        strokeWidth: 2,
        width: 32,
        height: 42,
        // shadowBlur: 10, ???
        sceneFunc: function (context, shape) {
          context.beginPath();
          context.arc(0, 0, 15, 0, Math.PI, true);
          context.bezierCurveTo(-15, 18, 0, 9, 0, 28); //TODO Из переменных брать
          context.bezierCurveTo(0, 9, 15, 18, 15, 0);
          context.fillStrokeShape(shape);
        }
      });
      layerMarkers.add(marker);
      

      var s = new XMLSerializer();
      var str = s.serializeToString(image);
      
      console.log('Violation', str)


      // Рисуем иконку
      Konva.Image.fromURL('/icons/Violation.svg', (iconNode: Konva.Image) => { //TODO Брать из перечисления иконку
        
        const parser = new DOMParser();
        const srcIcon = parser.parseFromString(iconNode.toObject(), "image/svg+xml");
        // console.log('iconNode', iconNode)
        // iconNode.attrs.image.style.color = '#d40000';
        iconNode.setAttrs({
          x: x-10,
          y: y-10,
          scaleX: 1,
          scaleY: 1,
          colorKey: '#d40000',
          currentColor: '#d40000',
          color: '#d40000',
          colors: ['#d40000', '#d40000']
        });
        layerMarkers.add(iconNode);
      });
      // var path = new Konva.Path()
    })

    console.log('layer', layerMarkers)
    stage.add(layerPlan);
    stage.add(layerMarkers);
    PlanInstance.setStage(stage);
  }

  


  return {
    createMainStage,
  }
}
