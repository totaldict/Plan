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
  Color1 = 'color1',
  Color2 = 'color2',
  Color3 = 'color3',
  Color4 = 'color4',
  Color5 = 'color5',
}

/** Мапа цветов маркеров */
export const markerColorMap = {
  [colorType.Color1]: '#FFEDD8',
  [colorType.Color2]: '#E5F2FF',
  [colorType.Color3]: '#FFFADE',
  [colorType.Color4]: '#E7F7DA',
  [colorType.Color5]: '#FFE3E7',
};

/** Мапа цветов иконок на маркерах */
export const iconColorMap = {
  [colorType.Color1]: '#FF9D28',
  [colorType.Color2]: '#60B2FF',
  [colorType.Color3]: '#FFD800',
  [colorType.Color4]: '#90D857',
  [colorType.Color5]: '#FD2942',
};

/** Мапа цветов для текста */
export const textColorMap = {
  [colorType.Color1]: '#DF7100',
  [colorType.Color2]: '#0071DB',
  [colorType.Color3]: '#D3B200',
  [colorType.Color4]: '#55AD10',
  [colorType.Color5]: '#C90018',
};
