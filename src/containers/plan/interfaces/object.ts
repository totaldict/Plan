import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { colorType, objectType } from './enums';

interface IPlanContainer {
  container?: HTMLDivElement;
}

export interface IPlanInstance extends IPlanContainer, Size {
  stage: Stage;
  layerPlan: Layer;
  layerMarkers: Layer;
  objects: IObject[];
  openCoord?: IOpenCoord;
  scale: number;
  /** Смещение координат, чтобы влезли все маркеры */
  offset: ICoords;
};

export interface ICoords {
  x: number;
  y: number;
};

export interface IOpenCoord {
  begin?: ICoords;
  end?: ICoords;
};

interface IColor {
  color: colorType;
};

interface ICommonObject {
  name: string;
};

export interface IPieceMarker extends IColor, ICommonObject {}

export interface IObject extends IColor, ICommonObject {
  coords: ICoords;
  type: objectType;
  pieces?: IPieceMarker[];
};

interface IMarkers {
  markers?: ICoords[];
};

interface ICommonPlanProps {
  planId: string;
  planUrl: string;
  planName: string;
};

/** Маркеры по цветам */
export interface IColorMarker extends IMarkers, IColor {};


/** Входные данные по Плану */
export interface IRawPlanProps extends IMarkers, ICommonPlanProps {};

/** Обработанные данные с разбивкой на цвета */
export interface IPlanProps extends ICommonPlanProps {
  colorMarkers: IColorMarker[];
};

export interface Size {
  width?: number;
  height?: number;
}

export interface IComponentPlanProps extends IPlanProps, Partial<Size>, Partial<IPlanContainer> {};

/** Максимальные и минимальные координаты маркеров */
export interface IMinMaxCoords {
  minCoord: ICoords;
  maxCoord: ICoords;
}
