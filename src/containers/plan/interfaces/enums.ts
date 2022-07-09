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
