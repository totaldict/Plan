import { IObject } from "../interfaces/object";

/**
 * Возвращает признак, чётное ли число
 * @param value 
 * @returns 
 */
export const isEven = (value: number): boolean => value % 2 === 0;

export const compareByColor = (a: IObject, b: IObject) => {
    if (a.color > b.color) {
      return 1;
    }
    if (a.color < b.color) {
      return -1;
    }
    return 0;
  }
