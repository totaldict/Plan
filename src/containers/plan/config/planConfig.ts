import * as React from 'react';

interface IPlanConfig {
  items: {
    /** Расстояние попапа от центра маркера */
    deltaMenu: number,
    /** Радиус объединяющего маркера */
    combineMarkerRadius: number,
    /** Точность объединения рядом стоящих маркеров */
    accuracy: number,
    /** Отступ по краям полотна для маркеров */
    indent: number,
  },
  text: {
    /** Отступы для текста на плашке маркера */
    textPadding: {
      horizontal: number,
      vertical: number,
    }
  },
  /** Высота панельки страничек */
  panelHeight: number,
}

const planConfig = (): IPlanConfig => ({
  items: {
    deltaMenu: 28,
    combineMarkerRadius: 16,
    accuracy: 45,
    indent: 75,
  },
  text: {
    textPadding: {
      horizontal: 5,
      vertical: 3,
    }
  },
  panelHeight: 60,
});

export default planConfig;
