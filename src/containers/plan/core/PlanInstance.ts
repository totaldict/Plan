import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { objectType } from "../interfaces/enums";
import { IPlanInstance, IObject, IPlanProps } from "../interfaces/object";

class PlanInstance {
  private static instance: IPlanInstance;
  constructor(props: IPlanProps) {
    if (PlanInstance.instance) {
      return PlanInstance.instance;
    }
    const { planId, markers = [] } = props;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.stage = new Konva.Stage({
      container: 'root',
      width: width,
      height: height,
    });
    this.layerPlan = new Konva.Layer({ id: `${planId}_plan` });
    this.layerMarkers = new Konva.Layer({ id: `${planId}_markers` });
    
    markers.forEach((marker) => {
      const newObj: IObject = {
        coords: {
          x: marker.x,
          y: marker.y,
        },
        type: objectType.Violation, //TODO Сейчас по умолчанию все маркеры ставлю как "нарушения"
      }
      this.objects.push(newObj);
    })
    
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
