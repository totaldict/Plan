import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { objectType } from "../interfaces/enums";
import { IPlanInstance, IObject, IPlanProps, IPieceMarker } from "../interfaces/object";
import { compareByColor } from "./utils";

//TODO вынести в константы. Точность объединения рядом стоящих маркеров
const accuracy = 45;

class PlanInstance {
  private static instance: IPlanInstance;
  constructor(props: IPlanProps) {
    if (PlanInstance.instance) {
      return PlanInstance.instance;
    }
    const { planId, colorMarkers = [] } = props;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.stage = new Konva.Stage({
      container: 'root',
      width: width,
      height: height,
    });
    this.layerPlan = new Konva.Layer({ id: `${planId}_plan` });
    this.layerMarkers = new Konva.Layer({ id: `${planId}_markers` });

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
        const deltaX = Math.abs(srcX - x);
        const deltaY = Math.abs(srcY - y);
        // возвращаем только те элементы, у которых координаты рядом с искомым
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

  stage: Stage;
  layerPlan: Layer;
  layerMarkers: Layer;
  objects: IObject[] = [];

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
