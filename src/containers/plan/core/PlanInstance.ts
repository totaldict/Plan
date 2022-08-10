import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import planConfig from '../config/planConfig';
import { objectType } from '../interfaces/enums';
import { IPlanInstance, IObject, IPieceMarker, IComponentPlanProps, ICoords, IMinMaxCoords } from '../interfaces/object';
import { compareByColor, getIndentCoords, getMarkersCoords, getScale } from './utils';

class PlanInstance {
  container?: HTMLDivElement;
  stage: Stage;
  layerPlan: Layer;
  layerMarkers: Layer;
  layerLimit: Layer;
  objects: IObject[] = [];
  width?: number;
  height?: number;
  scale = 1;
  offset: ICoords;
  planId: string;
  minMaxCoords: IMinMaxCoords;

  private static instance: IPlanInstance;
  constructor(props: IComponentPlanProps) {
    if (PlanInstance.instance && PlanInstance.instance.planId === props.planId) {
      return PlanInstance.instance;
    }
    const { items: { accuracy, indent }, panelHeight } = planConfig();

    const { container, planId, colorMarkers = [] } = props;

    if (!container) {
      return;
    }

    this.container = container;
    this.planId = planId;

    this.width = container?.clientWidth || window.innerWidth;
    this.height = container?.clientHeight || window.innerHeight - panelHeight;

    this.stage = new Konva.Stage({
      container: container as HTMLDivElement,
      width: this.width,
      height: this.height,
    });

    let index = 0;
    const allObjects: IObject[] = [];
    colorMarkers.forEach(({ markers, color }) => {
      markers?.forEach(({ x, y }) => {
        const newObj: IObject = {
          coords: {
            x,
            y,
          },
          color,
          name: `№ ${index}`,
          id: `id${index}`,
          type: objectType.Violation, // Сейчас по умолчанию все маркеры ставлю как "нарушения"
        }
        index++;
        allObjects.push(newObj);
      })
    })

    this.minMaxCoords = getMarkersCoords(allObjects);
    const indentCoords = getIndentCoords(this.minMaxCoords, indent);
    // Рассчёт массштаба, включая отступы
    this.scale = getScale(indentCoords, this.width, this.height);
    const { x: minX, y: minY } = indentCoords.minCoord;
    this.offset = {
      x: minX,
      y: minY,
    }

    this.layerPlan = new Konva.Layer({
      id: `${planId}_plan`,
      offsetX: this.offset.x * this.scale,
      offsetY: this.offset.y * this.scale,
    });
    this.layerMarkers = new Konva.Layer({
      id: `${planId}_markers`,
      offsetX: this.offset.x * this.scale,
      offsetY: this.offset.y * this.scale,
    });
    this.layerLimit = new Konva.Layer({
      id: `${planId}_limit`,
      offsetX: this.offset.x * this.scale,
      offsetY: this.offset.y * this.scale,
    });

    /** сюда складываем все маркеры + объединённые маркеры */
    const unitedMarkers: IObject[] = [];
    /** id обновлённых маркеров */
    const updatedMarkers: string[] = [];
    allObjects.forEach((object) => {
      const { coords: srcCoords, name: srcName, color, id: srcId } = object;
      const { x: srcX, y: srcY } = srcCoords;
      // если маркер уже в обновлённых - идём дальше
      if (updatedMarkers.includes(srcId)) {
        return;
      }
      // ищем соседей этого маркера
      const neighbours = allObjects.filter(({ coords, id }) => {
        const { x, y } = coords;
        const deltaX = Math.abs(srcX - x) * this.scale;
        const deltaY = Math.abs(srcY - y) * this.scale;
        if (updatedMarkers.includes(id)) {
          return false;
        }
        // возвращаем только те элементы, у которых координаты рядом с искомым, конечно учитывая отношение шкалы
        return deltaX < accuracy && deltaY < accuracy;
      })

      if (neighbours.length === 1) {
        unitedMarkers.push(object);
        updatedMarkers.push(srcId);
      } else {
        neighbours.sort(compareByColor);
        //добавляем объединяющий маркер
        const pieces = neighbours.map((piece): IPieceMarker => {
          updatedMarkers.push(piece.id);
          return piece;
        });
        const unitedObject: IObject = {
          pieces,
          name: srcName,
          coords: srcCoords,
          type: objectType.CombineMarker,
          color,
          id: srcId,
        };
        unitedMarkers.push(unitedObject);
      }

    })
    
    this.objects = unitedMarkers;
    PlanInstance.instance = this;
    return PlanInstance.instance;
  }

  static setStage(value: Stage) {
    this.instance.stage = value;
  }
}

export default PlanInstance;
