export enum keys {
  ArrowLeft = 'ArrowLeft', 
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
}

/** Тип объекта на холсте */
export enum objectType {
  Marker = 'Marker',
  /** Нарушение */
  Violation = 'Violation',
  /** Осмотр */
  Inspection = 'Inspection',
  /** Объединяющий маркер */
  CombineMarker = 'CombineMarker',
  None = 'None',
}

/** Цветовые наборы */
export enum colorType {
  color1 = 'color1',
  color2 = 'color2',
  color3 = 'color3',
  color4 = 'color4',
  color5 = 'color5',
}

/** Мапа цветов маркеров */
export const markerColorMap = {
  [colorType.color1]: '#FFEDD8',
  [colorType.color2]: '#E5F2FF',
  [colorType.color3]: '#FFFADE',
  [colorType.color4]: '#E7F7DA',
  [colorType.color5]: '#FFE3E7',
}

/** Мапа цветов иконок на маркерах */
export const iconColorMap = {
  [colorType.color1]: '#FF9D28',
  [colorType.color2]: '#60B2FF',
  [colorType.color3]: '#FFD800',
  [colorType.color4]: '#90D857',
  [colorType.color5]: '#FD2942',  
}

/** Мапа цветов для текста */
export const textColorMap = {
  [colorType.color1]: '#DF7100',
  [colorType.color2]: '#0071DB',
  [colorType.color3]: '#D3B200',
  [colorType.color4]: '#55AD10',
  [colorType.color5]: '#C90018',
}

//TODO На ховер текст белый, сама плашка цвета иконки обычной