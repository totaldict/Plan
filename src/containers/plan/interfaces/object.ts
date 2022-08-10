import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { colorType, objectType } from './enums';

interface IPlanContainer {
  container?: HTMLDivElement;
}

export interface IPlanInstance extends IPlanContainer, Size, IPlanId {
  stage: Stage;
  layerPlan: Layer;
  layerMarkers: Layer;
  /** Слой для ограничения маркеров */
  layerLimit: Layer;
  objects: IObject[];
  openCoord?: IOpenCoord;
  scale: number;
  /** Смещение координат, чтобы влезли все маркеры */
  offset: ICoords;
  /** Минимальная/максимальная координата маркеров */
  minMaxCoords: IMinMaxCoords;
}

export interface ICoords {
  x: number;
  y: number;
}

export interface IOpenCoord {
  begin?: ICoords;
  end?: ICoords;
}

interface IColor {
  color: colorType;
}

interface IObjectType {
  type: objectType;
}

interface ICommonObject {
  name: string;
  id: string;
}

export interface IPieceMarker extends IColor, ICommonObject, IObjectType {}

export interface IObject extends IColor, ICommonObject, IObjectType {
  coords: ICoords;
  pieces?: IPieceMarker[];
}

interface IMarkers {
  markers?: ICoords[];
}

interface IPlanId {
  planId: string;
}

interface ICommonPlanProps extends IPlanId {
  planUrl: string;
  planName: string;
}

/** Маркеры по цветам */
export interface IColorMarker extends IMarkers, IColor {}


/** Входные данные по Плану */
export interface IRawPlanProps extends IMarkers, ICommonPlanProps {}

/** Обработанные данные с разбивкой на цвета */
export interface IPlanProps extends ICommonPlanProps {
  colorMarkers: IColorMarker[];
}

export interface Size {
  width?: number;
  height?: number;
}

/** Интерфейс для работы с огранисением области маркеров */
interface IPlanLimit {
  limit?: boolean;
}

export interface IComponentPlanProps extends IPlanProps, Partial<Size>, Partial<IPlanContainer>, IPlanLimit {}

/** Максимальные и минимальные координаты маркеров */
export interface IMinMaxCoords {
  minCoord: ICoords;
  maxCoord: ICoords;
}
