import { ICoords, IMinMaxCoords, IObject } from "../interfaces/object";

export const compareByColor = (a: IObject, b: IObject) => {
  if (a.color > b.color) {
    return 1;
  }
  if (a.color < b.color) {
    return -1;
  }
  return 0;
}

/**
 * Получение максимальноых и минимальных координат маркеров
 * @param {IObject[]} objects Маркеры
 * @returns {IMinMaxCoords} Координаты мин/макс маркеров
 */
export const getMarkersCoords = (objects: IObject[]): IMinMaxCoords => {
  const minCoord: ICoords = { x: 0, y: 0 };
  const maxCoord: ICoords = {  x: 0, y: 0 };
  objects.forEach(({ coords }) => {
    const { x, y } = coords;
    if (!maxCoord.x || x > maxCoord.x) {
      maxCoord.x = x;
    }
    if (!maxCoord.y || y > maxCoord.y) {
      maxCoord.y = y;
    }
    if (!minCoord.x || x < minCoord.x) {
      minCoord.x = x;
    }
    if (!minCoord.y || y < minCoord.y) {
      minCoord.y = y;
    }
  })
  return { minCoord, maxCoord };
}

/** Получение крайних координат с учётом отступа по краям */
export const getIndentCoords = (coords: IMinMaxCoords, indent: number): IMinMaxCoords => {
  const { maxCoord, minCoord } = coords;
  maxCoord.x = maxCoord.x + indent;
  maxCoord.y = maxCoord.y + indent;
  minCoord.x = minCoord.x - indent;
  minCoord.y = minCoord.y - indent;
  return { maxCoord, minCoord };
}

/**
 * Рассчитывает соотношение области окна к области, на которой присутствуют маркеры по координатам.
 * @param {IMinMaxCoords} coords Координаты мин/макс маркеров
 * @param {number} width Ширина окна
 * @param {number} height Высота окна
 * @returns {number} Соотношение области окна к области координат маркеров
 */
export const getScale = (coords: IMinMaxCoords, width: number, height: number): number => {
  const { maxCoord, minCoord } = coords;
  const markersWidth = Math.round(Math.abs(maxCoord.x - minCoord.x));
  const markersHeight = Math.round(Math.abs(maxCoord.y - minCoord.y));
  const widthRatio = width / markersWidth;
  const heightRatio = height / markersHeight;
  const scale = Math.min(widthRatio, heightRatio);
  return scale;
}