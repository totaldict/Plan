import * as React from 'react';
import Konva from 'konva';
import { NodeConfig } from 'konva/lib/Node';
import { RectConfig } from 'konva/lib/shapes/Rect';
import PlanInstance from '../../containers/plan/core/PlanInstance';
import { blockWidth, deltaMove, numberBlocksInHeight, numberBlocksInWidth, stageBegin } from '../../containers/plan/interfaces/constants';
import { colorType, iconColorMap, keys, markerColorMap, objectType, textColorMap } from '../../containers/plan/interfaces/enums';
import colors from '../../styles/colors';
import { isEven } from '../../containers/plan/core/utils';
import { IComponentPlanProps, IObject, IPlanProps } from '../../containers/plan/interfaces/object';
import useImage from 'use-image';
import { Image } from "react-konva";
import Violation from '../../assets/icons/Violation.svg';
import fonts from '../../styles/fonts';
import { getContext } from './utils';

//TODO Вынести эти константы в дефолтные настройки
const textPaddingH = 5;
const textPaddingV = 3;
const combineMarkerRadius = 16;

export const useMainStage = (props: IComponentPlanProps) => {
  const { planId, colorMarkers, planName, planUrl, container } = props;
  const [image] = useImage('/icons/Violation.svg', "anonymous");
  // console.log('image', image)
  
  // Получаем контекст для измерения текста
  const { family, fontStyle, size, lineHeight } = fonts;
  const context = getContext(fontStyle, size, family);

  /** Создаёт обычный маркер */
  const createMarker = (marker: IObject, idx: number): Konva.Group => {
    const { color, coords, name } = marker;
    const { x, y } = coords;
    const idPlate = `${idx}_plate`;
    const idPlateText = `${idx}_plateText`;
    const idMarker = `${idx}_marker`;

    const markerColor = markerColorMap[color];
    const textColor = textColorMap[color];
    // Рисуем плашку с номером
    const measuredLength = context.measureText(name).width;
    const plateWidth = textPaddingH * 2 + measuredLength;
    const plate = new Konva.Rect({
      id: idPlate,
      cornerRadius: 2,
      x: x - plateWidth / 2,
      y: y - 40,
      height: 20,
      width: plateWidth,
      shadowBlur: 5,
      fill: colors.white,
    })
    // Рисуем текст на плашку
    const plateText = new Konva.Text({
      id: idPlateText,
      text: name,
      x: x - measuredLength / 2,
      y: y - 40 + 1 + textPaddingV,
      width: measuredLength,
      height: lineHeight,
      // scaleX: scale,
      // scaleY: scale,
      align: 'center',
      verticalAlign: 'center',
      wrap: 'none',
      fill: textColor,
      fontSize: size,
      fontFamily: family,
      lineHeight: 1.1,
      fontStyle: fontStyle,
      // fontStyle: selected ? selectionFontStyle : fontStyle,
    });

    // Рисуем маркер
    const markerShape = new Konva.Shape({
    id: idMarker,
      x: x,
      y: y,
      fill: markerColor,
      stroke: '#FFFFFF',
      strokeWidth: 2,
      width: 32,
      height: 42,
      shadowBlur: 5,
      sceneFunc: function (context, shape) {
        context.beginPath();
        context.arc(0, 0, 15, 0, Math.PI, true);
        context.bezierCurveTo(-15, 18, 0, 9, 0, 28); //TODO Из переменных брать
        context.bezierCurveTo(0, 9, 15, 18, 15, 0);
        context.fillStrokeShape(shape);
      }
    });

    const group = new Konva.Group();
    group.add(plate)
    group.add(plateText)
    group.add(markerShape)


    // var s = new XMLSerializer();
    // var str = s.serializeToString(image);

    // console.log('Violation', Violation)
    // const parser = new DOMParser();
    // const srcIcon = parser.parseFromString(Violation., "image/svg+xml");
    // console.log('srcIcon', (Violation as React.SVGProps<{}>).path)

    // Рисуем иконку
    Konva.Image.fromURL('/icons/Violation.svg', (iconNode: Konva.Image) => { //TODO Брать из перечисления иконку
      // iconNode.attrs.image.style.color = '#d40000';
      iconNode.setAttrs({
        x: x-10,
        y: y-10,
        scaleX: 1,
        scaleY: 1,
        colorKey: '#d40000',
        currentColor: '#d40000',
        color: '#d40000',
        colors: ['#d40000', '#d40000'],
        path: null
      });
      group.add(iconNode);
    });
    // var path = new Konva.Path()
    group.on('mouseover', () => {
      group.getChildren((item) => item.id() === idPlate)[0].setAttr('fill', iconColorMap[color]);
      group.getChildren((item) => item.id() === idPlateText)[0].setAttr('fill', colors.white);
    });
    group.on('mouseout', () => {
      group.getChildren((item) => item.id() === idPlate)[0].setAttr('fill', colors.white);
      group.getChildren((item) => item.id() === idPlateText)[0].setAttr('fill', textColor);
    });
    return group;
  } 
  
  /** Создаёт комбинированный маркер */
  const createCombineMarker = (marker: IObject, idx: number): Konva.Group => {
    const { coords, pieces } = marker;
    const { x, y } = coords;
    const piecesCount = pieces?.length ?? 1;
    // Основной круг шейпа
    const circle = new Konva.Circle({
      x,
      y,
      fill: colors.white,
      id: `${idx}_circle`, //TODO везде проставить IDшники у всех фигур
      radius: combineMarkerRadius,
      shadowBlur: 5,
    })
    // Текст с количеством объединенных маркеров
    const markerText = piecesCount.toString();
    const measuredLength = context.measureText(markerText).width;
    const plateText = new Konva.Text({
      text: markerText,
      x: x - measuredLength / 2,
      y: y - size / 2,
      width: measuredLength,
      height: lineHeight,
      // scaleX: scale,
      // scaleY: scale,
      align: 'center',
      verticalAlign: 'center',
      wrap: 'none',
      fill: colors.dark,
      fontSize: size,
      fontFamily: family,
      lineHeight: 1.1,
      fontStyle: fontStyle,
    });

    const group = new Konva.Group();
    group.add(circle);
    group.add(plateText);

    const pieceAngle = 360 / piecesCount; // размер одного сектора
    let deltaAngle = -90; // угол смещения сектора
    pieces?.forEach(({ color, name }) => {
      const arc = new Konva.Arc({
        x,
        y,
        innerRadius: 11,
        outerRadius: 14,
        fill: iconColorMap[color],
        angle: pieceAngle,
        rotation: deltaAngle,
      });
      deltaAngle += pieceAngle;
      group.add(arc);
    })

    //TODO Попробовать сделать так же, рендерим менюху в document, а потом просто меняем координату https://konvajs.org/docs/sandbox/Canvas_Context_Menu.html
    // group.on('mouseover', () => {
    //   group.getChildren((item) => item.id() === idPlate)[0].setAttr('fill', iconColorMap[color]);
    //   group.getChildren((item) => item.id() === idPlateText)[0].setAttr('fill', colors.white);
    // });
    // group.on('mouseout', () => {
    //   group.getChildren((item) => item.id() === idPlate)[0].setAttr('fill', colors.white);
    //   group.getChildren((item) => item.id() === idPlateText)[0].setAttr('fill', textColor);
    // });
    return group;
  }

  const createMainStage = () => {
    const devicePixelRatio = window.devicePixelRatio;
    console.log('devicePixelRatio', devicePixelRatio)
    if (!container) {
      return;
    }
    const instance = new PlanInstance(props);
    const { layerPlan, layerMarkers, stage, objects = [] } = instance;

    Konva.Image.fromURL('/mock/plan-1.jpg', (imageNode: Konva.Image) => {
      imageNode.setAttrs({
        scaleX: 1,
        scaleY: 1,
      });
      layerPlan.add(imageNode);
    });

    objects.forEach((marker, idx) => {
      const { type } = marker;
      const markerShape = type === objectType.CombineMarker ? createCombineMarker(marker, idx) : createMarker(marker, idx);
      layerMarkers.add(markerShape);
    })

    

    // console.log('layer', layerMarkers)
    stage.add(layerPlan);
    stage.add(layerMarkers);
    PlanInstance.setStage(stage);
  }

  


  return {
    createMainStage,
  }
}
