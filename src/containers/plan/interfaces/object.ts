import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { objectType } from './enums';

export interface IPlanInstance {
  stage: Stage;
  layerPlan: Layer;
  layerMarkers: Layer;
  objects: IObject[];
  openCoord?: IOpenCoord;
}

export interface ICoords {
  x: number;
  y: number;
}

export interface IOpenCoord {
  begin?: ICoords;
  end?: ICoords;
}

export interface IObject {
  coords: ICoords;
  type: objectType;
}

/** Входные данные по Плану */
export interface IPlanProps {
  planId: string;
  planUrl?: string;
  planName?: string;
  markers?: ICoords[];
}
