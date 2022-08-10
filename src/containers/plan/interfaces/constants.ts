import { getViolationSvg, getInspectionSvg } from '../../../assets/icons/svgSource';
import {ReactComponent as ViolationIcon} from '../../../assets/icons/violation.svg';
import {ReactComponent as InspectionIcon} from '../../../assets/icons/inspection.svg';
import { ICoords } from './object';
import { objectType } from './enums';

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
};

export const getSvgFunc = {
  [objectType.Inspection]: getInspectionSvg,
  [objectType.Violation]: getViolationSvg,
};

export const iconMap = {
  [objectType.Violation]: ViolationIcon,
  [objectType.Inspection]: InspectionIcon,
  [objectType.CombineMarker]: ViolationIcon, //по умолчанию иконка с violation
  [objectType.Marker]: ViolationIcon,
  [objectType.None]: ViolationIcon,
};
