import * as React from 'react';
import Konva from 'konva';
import { ImageConfig } from 'konva/lib/shapes/Image';
import classNames from 'classnames';
import PlanInstance from '../core/PlanInstance';
import { iconColorMap, markerColorMap, objectType, textColorMap } from '../interfaces/enums';
import { IComponentPlanProps, ICoords, IMinMaxCoords, IObject } from '../interfaces/object';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import { getContext } from '../core/utils';
import { getViolationSvg, getInspectionSvg } from '../../../assets/icons/svgSource';
import {ReactComponent as ViolationIcon} from '../../../assets/icons/violation.svg'; //TODO вынести иконки в утилиту
import {ReactComponent as InspectionIcon} from '../../../assets/icons/inspection.svg';
import planConfig from '../config/planConfig';

const popupPrefix = 'plan-popup';

const markerWithIcons = [objectType.Inspection, objectType.Violation];
type WithIcons = objectType.Inspection | objectType.Violation;

const getSvgFunc = {
  [objectType.Inspection]: getInspectionSvg,
  [objectType.Violation]: getViolationSvg,
}

const iconMap = {
  [objectType.Violation]: ViolationIcon,
  [objectType.Inspection]: InspectionIcon,
  [objectType.CombineMarker]: ViolationIcon, //по умолчанию иконка с violation
  [objectType.Marker]: ViolationIcon,
  [objectType.None]: ViolationIcon,
}

export const useMainStage = (props: IComponentPlanProps) => {
  const { planUrl, container } = props;
  const { items: { combineMarkerRadius, deltaMenu }, text: { textPadding } } = planConfig();
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
    const plateWidth = textPadding.horizontal * 2 + measuredLength;
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
      y: scaledY - 40 + 1 + textPadding.vertical,
      width: measuredLength,
      height: lineHeight,
      align: 'center',
      verticalAlign: 'center',
      wrap: 'none',
      fill: textColor,
      fontSize: size,
      fontFamily: family,
      lineHeight: 1.1,
      fontStyle: fontStyle,
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

    // Рисуем иконку у маркера если она есть
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

    const fillPlate = (hover: boolean) => {
      const plateColor = hover ? iconColorMap[color] : colors.white;
      const captionColor = hover ? colors.white : textColor;
      group.getChildren((item) => item.id() === idPlate)[0].setAttr('fill', plateColor);
      group.getChildren((item) => item.id() === idPlateText)[0].setAttr('fill', captionColor);
    }
    
    group.on('mouseover', () => {
      fillPlate(true);
    });
    group.on('mouseout', () => {
      fillPlate(false);
    });
    return group;
  } 
  
  /** Создаёт комбинированный маркер */
  const createCombineMarker = (marker: IObject, idx: number, scale: number, offset: ICoords): Konva.Group => {
    const { coords, pieces, id } = marker;
    const { x, y } = coords;
    const scaledX = x * scale;
    const scaledY = y * scale;
    const piecesCount = pieces?.length ?? 1;
    // Основной круг шейпа
    const circle = new Konva.Circle({
      x: scaledX,
      y: scaledY,
      fill: colors.white,
      id: `${idx}_circle`,
      radius: combineMarkerRadius,
      shadowBlur: 5,
    })
    // Текст с количеством объединенных маркеров
    const markerText = piecesCount.toString();
    const measuredLength = context.measureText(markerText).width;
    const plateText = new Konva.Text({
      id: `${idx}_text`,
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
        innerRadius: combineMarkerRadius - 5,
        outerRadius: combineMarkerRadius - 2,
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
      // вычисляем, куда отобразить попап
      const { height: popupHeight, width: popupWidth } = popupNode.getBoundingClientRect();
      const targetCenterX = scaledX - offset.x * scale;
      const targetCenterY = scaledY - offset.y * scale;
      const popupX = targetCenterX - popupWidth / 2; 
      const popupY = targetCenterY < (deltaMenu + popupHeight)
        ? targetCenterY + deltaMenu
        : targetCenterY - (deltaMenu + popupHeight);

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

  const createMainStage = (limitCoords?: IMinMaxCoords) => {
    if (!container) {
      return;
    }
    const instance = new PlanInstance(props);
    const { layerPlan, layerMarkers, layerLimit, stage, offset, minMaxCoords, objects = [], scale = 1 } = instance;
    const { maxCoord: { x: maxX, y: maxY }, minCoord: { x: minX, y: minY } } = limitCoords ?? minMaxCoords;

    if (layerPlan.find('#plan-img').length < 1) {
      Konva.Image.fromURL(`./mock${planUrl}`, (imageNode: Konva.Image) => {
        const imageAttrs: Partial<ImageConfig> = {
          id: 'plan-img',
          scaleX: scale,
          scaleY: scale,
        }
        imageNode.setAttrs(imageAttrs);
        layerPlan.add(imageNode);
      });
    }
    layerMarkers.destroyChildren();

    objects.forEach((marker, idx) => {
      const { type, coords: { x, y } } = marker;
      // Если маркер не входит в обозначенную зону - его не рисуем.
      const notInArea = x < minX  || x > maxX  || y < minY  || y > maxY ;
      if (notInArea) {
        return;
      }
      const markerShape = type === objectType.CombineMarker
        ? createCombineMarker(marker, idx, scale, offset)
        : createMarker(marker, idx, scale);
      layerMarkers.add(markerShape);
    })

    stage.add(layerPlan);
    stage.add(layerLimit);
    stage.add(layerMarkers);
    PlanInstance.setStage(stage);
  }

  const renderPopups = React.useCallback(() => {
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
  // тут не надо больше зависимостей
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, iconMap, props])

  return {
    createMainStage,
    renderPopups,
  }
}
