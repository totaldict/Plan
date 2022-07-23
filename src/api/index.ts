import { colorType } from "../containers/plan/interfaces/enums";
import { IColorMarker, IPlanProps, IRawPlanProps } from "../containers/plan/interfaces/object";

export const apiMock: IRawPlanProps[] = require('./api.mock.json');

/** Функция получения инфы с бэка */
export const getInfo = (): IPlanProps[] => {
  console.log(apiMock)
  let currentId = '';
  const result: IPlanProps[] = [];
  let tempPlan: IPlanProps; 
  const colorTypeByIdx = Object.values(colorType);
  apiMock.forEach((item, idx) => {
    const { planId, markers, planName, planUrl } = item;
    // Если сменился ID, то добавляем план в коллекцию
    if (planId !== currentId && idx !== 0) {
      result.push({ ...tempPlan });
      tempPlan.colorMarkers = [];
    };
    
    currentId = planId;
    const color = colorTypeByIdx[colorTypeByIdx.length > idx ? idx : 0];
    const colorMarker: IColorMarker = {
      color,
      markers,
    };
    const colorMarkers = tempPlan?.colorMarkers || [];
    colorMarkers.push(colorMarker);
    tempPlan = {
      planId,
      planName,
      planUrl,
      colorMarkers,
    }
    // последний добавляем в любом случае в коллекцию
    if (idx === apiMock.length - 1) {
      result.push(tempPlan);
    }
    
  })
  return result;
}
