import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { objectType } from "../interfaces/enums";
import { IPlanInstance, IObject, IPieceMarker, IComponentPlanProps, ICoords } from "../interfaces/object";
import { compareByColor, getMarkersCoords, getScale } from "./utils";

//TODO вынести в константы. Точность объединения рядом стоящих маркеров
const accuracy = 45;
const panelHeight = 28 + 16 * 2;

class PlanInstance {
  container?: HTMLDivElement;
  stage: Stage;
  layerPlan: Layer;
  layerMarkers: Layer;
  objects: IObject[] = [];
  width?: number;
  height?: number;
  scale = 1;
  offset: ICoords;

  private static instance: IPlanInstance;
  constructor(props: IComponentPlanProps) {
    if (PlanInstance.instance) {
      return PlanInstance.instance;
    }
    const { container, planId, colorMarkers = [] } = props;
    this.container = container;
    
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
          type: objectType.Violation, //TODO Сейчас по умолчанию все маркеры ставлю как "нарушения"
        }
        index++;
        allObjects.push(newObj);
      })
    })

    const minMaxCoords = getMarkersCoords(allObjects);
    // Предварительный расчёт масштаба
    const tempScale = getScale(minMaxCoords, this.width, this.height);
    // Добавочный отступ, чтобы влезали все маркеры
    const fitOffset = accuracy / tempScale;
    minMaxCoords.minCoord.x -= fitOffset;
    minMaxCoords.minCoord.y -= fitOffset;
    // Уточненный рассчёт массштаба, включая отступы
    this.scale = getScale(minMaxCoords, this.width, this.height);
    const { x: minX, y: minY } = minMaxCoords.minCoord;
    this.offset = {
      x: minX,
      y: minY,
    }

    // this.scale = 1;
    // this.offset = {
    //   x: 0,
    //   y: 0,
    // }

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

    /** сюда складываем все маркеры + объединённые маркеры */
    const unitedMarkers: IObject[] = [];
    /** имена обновлённых маркеров */
    const updatedMarkers: string[] = [];
    allObjects.forEach((object) => {
      const { coords: srcCoords, name: srcName, color } = object;
      const { x: srcX, y: srcY } = srcCoords;
      // если маркер уже в обновлённых - идём дальше
      if (updatedMarkers.includes(srcName)) {
        return;
      }
      // ищем соседей этого маркера
      const neighbours = allObjects.filter(({ coords, name}) => {
        const { x, y } = coords;
        const deltaX = Math.abs(srcX - x) * this.scale;
        const deltaY = Math.abs(srcY - y) * this.scale;
        if (updatedMarkers.includes(name)) {
          return false;
        }
        // возвращаем только те элементы, у которых координаты рядом с искомым, конечно учитывая отношение шкалы
        return deltaX < accuracy && deltaY < accuracy;
      })

      if (neighbours.length === 1) {
        unitedMarkers.push(object);
        updatedMarkers.push(srcName);
      } else {
        neighbours.sort(compareByColor);
        //добавляем объединяющий маркер
        const pieces = neighbours.map(({ color, name }): IPieceMarker => {
          updatedMarkers.push(name);
          return { color, name };
        });
        const unitedObject: IObject = {
          pieces,
          name: srcName,
          coords: srcCoords,
          type: objectType.CombineMarker,
          color,
        };
        unitedMarkers.push(unitedObject);
      }

    })
    
    // console.log('unitedMarkers', unitedMarkers);
    this.objects = unitedMarkers;
    PlanInstance.instance = this;
    return PlanInstance.instance;
  }

  // static staticMethod() {
  //   return 'staticMethod';
  // }

  // get stage() {
  //   return this.stage;
  // }

  static setStage(value: Stage) {
    this.instance.stage = value;
  }

  // get layer() {
  //   return this.layer;
  // }

  // static setHeroCoord(value: IBlockCoord) {
  //   this.instance.heroCoord = value;
  // }
}

export default PlanInstance;
