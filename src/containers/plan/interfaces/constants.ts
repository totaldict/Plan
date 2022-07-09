import { ICoords } from "./object";

/** передвижение на одну ячейку */
export const deltaMove = 50;
/** Ширина блока. Блоки квадратные, значит равна высоте. */
export const blockWidth = 50;
/** количество блоков по высоте */
export const numberBlocksInHeight = 11;
/** количество блоков по ширине */
export const numberBlocksInWidth = 21;

export const stageBegin: ICoords = {
  x: blockWidth + 20,
  y: blockWidth + 70,
}
