import * as React from 'react';
import Konva from 'konva';
import { ImageConfig } from 'konva/lib/shapes/Image';
import classNames from 'classnames';
import PlanInstance from '../../containers/plan/core/PlanInstance';
import { iconColorMap, markerColorMap, objectType, textColorMap } from '../../containers/plan/interfaces/enums';
import colors from '../../styles/colors';
import { IComponentPlanProps, ICoords, IObject } from '../../containers/plan/interfaces/object';
import fonts from '../../styles/fonts';
import { getContext } from './utils';
import { getViolationSvg, getInspectionSvg } from '../../assets/icons/svgSource';
import {ReactComponent as ViolationIcon} from '../../assets/icons/violation.svg'; //вынести иконки в утилиту
import {ReactComponent as InspectionIcon} from '../../assets/icons/inspection.svg';

//TODO Вынести эти константы в дефолтные настройки
const textPaddingH = 5;
const textPaddingV = 3;
const combineMarkerRadius = 16;
// расстояние попапа от центра маркера
const deltaMenu = 28;

const popupPrefix = 'plan-popup';

const markerWithIcons = [objectType.Inspection, objectType.Violation];
type WithIcons = objectType.Inspection | objectType.Violation;

const getSvgFunc = {
  [objectType.Inspection]: getInspectionSvg,
  [objectType.Violation]: getViolationSvg,
}

export const useMainStage = (props: IComponentPlanProps) => {
  const { planId, colorMarkers, planName, planUrl, container } = props;
  // Получаем контекст для измерения текста
  const { family, fontStyle, size, lineHeight } = fonts;
  const context = getContext(fontStyle, size, family);


  /** Создаёт обычный маркер */
  const createMarker = (marker: IObject, idx: number, scale: number): Konva.Group => {
    const { color, coords, name, type } = marker;
    const { x, y } = coords;
    const scaledX = x * scale;
    const scaledY = y * scale;
    const idPlate = `${idx}_plate`;
    const idPlateText = `${idx}_plateText`;
    const idMarker = `${idx}_marker`;

    const markerColor = markerColorMap[color];
    const textColor = textColorMap[color];
    const iconColor = iconColorMap[color];
    // Рисуем плашку с номером
    const measuredLength = context.measureText(name).width;
    const plateWidth = textPaddingH * 2 + measuredLength;
    const plate = new Konva.Rect({
      id: idPlate,
      cornerRadius: 2,
      x: scaledX - plateWidth / 2,
      y: scaledY - 40,
      height: 20,
      width: plateWidth,
      shadowBlur: 5,
      fill: colors.white,
    })
    // Рисуем текст на плашку
    const plateText = new Konva.Text({
      id: idPlateText,
      text: name,
      x: scaledX - measuredLength / 2,
      y: scaledY - 40 + 1 + textPaddingV,
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
      x: scaledX,
      y: scaledY,
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

    // // Рисуем иконку у маркера если она есть
    if (markerWithIcons.includes(type)) {
      const getSvg = getSvgFunc[type as WithIcons];
      const iconSvg = getSvg(iconColor);
      const iconUrl = 'data:image/svg+xml;base64,' + window.btoa(iconSvg);
  
      Konva.Image.fromURL(iconUrl, (iconNode: Konva.Image) => {
        iconNode.setAttrs({
          x: scaledX - 10,
          y: scaledY - 10,
          scaleX: 1,
          scaleY: 1,
        });
        group.add(iconNode);
      });
    }
    
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
  const createCombineMarker = (marker: IObject, idx: number, scale: number, offset: ICoords): Konva.Group => {
    const { coords, pieces, id } = marker;
    const { x, y } = coords;
    const scaledX = x * scale;
    const scaledY = y * scale;
    // const scaledFontSize = size * scale;
    // const scaledLineHeight = lineHeight * scale;
    const piecesCount = pieces?.length ?? 1;
    // Основной круг шейпа
    const circle = new Konva.Circle({
      x: scaledX,
      y: scaledY,
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
      x: scaledX - measuredLength / 2,
      y: scaledY - size / 2,
      width: measuredLength,
      height: lineHeight,
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
        x: scaledX,
        y: scaledY,
        innerRadius: 11,
        outerRadius: 14,
        fill: iconColorMap[color],
        angle: pieceAngle,
        rotation: deltaAngle,
      });
      deltaAngle += pieceAngle;
      group.add(arc);
    })

    const popupNode = document.querySelector(`.${id}_popup`) as HTMLElement;
    group.on('mouseover', () => {
      if (!popupNode) {
        return;
      }
      const { height: popupHeight, width: popupWidth } = popupNode.getBoundingClientRect();
      const targetCenterX = scaledX - offset.x * scale;
      const targetCenterY = scaledY - offset.y * scale;
      const popupX = targetCenterX - popupWidth / 2; 
      const popupY = targetCenterY < (deltaMenu + popupHeight) ? targetCenterY + deltaMenu : targetCenterY - (deltaMenu + popupHeight);

      popupNode.style.opacity = '1';
      popupNode.style.zIndex = '100';
      popupNode.style.top = popupY + 'px';
      popupNode.style.left = popupX + 'px';;
    });
    group.on('mouseout', () => {
      if (!popupNode) {
        return;
      }
      popupNode.style.opacity = '0';
      popupNode.style.zIndex = '-2';
    });
    return group;
  }

  const createMainStage = () => {
    const devicePixelRatio = window.devicePixelRatio;
    console.log('devicePixelRatio', devicePixelRatio)
    if (!container) {
      return;
    }
    const instance = new PlanInstance(props);
    const { layerPlan, layerMarkers, stage, offset, objects = [], scale = 1 } = instance;

    Konva.Image.fromURL(`./mock${planUrl}`, (imageNode: Konva.Image) => {
      const imageAttrs: Partial<ImageConfig> = {
        scaleX: scale,
        scaleY: scale,
      }
      imageNode.setAttrs(imageAttrs);
      layerPlan.add(imageNode);
    });
    objects.forEach((marker, idx) => {
      const { type } = marker;
      const markerShape = type === objectType.CombineMarker
        ? createCombineMarker(marker, idx, scale, offset)
        : createMarker(marker, idx, scale);
      layerMarkers.add(markerShape);
    })

    

    // console.log('layer', layerMarkers)
    stage.add(layerPlan);
    stage.add(layerMarkers);
    PlanInstance.setStage(stage);
  }

  const iconMap = {
    [objectType.Violation]: ViolationIcon,
    [objectType.Inspection]: InspectionIcon,
    [objectType.CombineMarker]: ViolationIcon, //по умолчанию иконка с violation
    [objectType.Marker]: ViolationIcon,
    [objectType.None]: ViolationIcon,
  }

  const renderPopups = () => {
    if (!container) {
      return null;
    }
    const { objects } = new PlanInstance(props);
    const popups = objects.reduce((acc: JSX.Element[], marker) => {
      const { id, type, pieces } = marker;
      if (type === objectType.CombineMarker) {
        const cn = classNames(popupPrefix, `${id}_popup`);
        const list = (
          <div className={cn} key={id}>
            {pieces?.map((piece, idx) => {
              const IconComponent = iconMap[piece.type];
              return (
                <div key={`${piece.id}_${idx}`} className={`${popupPrefix}_piece`}>
                  <IconComponent className={`${popupPrefix}_icon`}/>
                  <span className={`${popupPrefix}_name`}>
                    {piece.name}
                  </span>
                </div>)}
              )
            }
          </div>
        )
        acc.push(list); 
      }
      return acc;
    }, [])
    return (
      <div className={`${popupPrefix}_group`}>
        {popups.map(popup => popup)}
      </div>
    )
  }

  return {
    createMainStage,
    renderPopups,
  }
}
