export const svgRaw = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'width: 10px; height: 10px; position:absolute; top:-9999px;');
    svg.setAttribute('image', '/icons/Violation.svg');
    document.body.appendChild(svg)
    console.log('svg', svg);
    // const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(svg)
    // const scrollDiv = document.createElement('div')
    // scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
    // document.body.appendChild(scrollDiv)
    // const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    // document.body.removeChild(scrollDiv)
    // return scrollbarWidth
}
  
/** Функция возвращает контекст текста */
 export const getContext = (fontStyle: string, textSize: number, fontFamily: string): CanvasRenderingContext2D => {
    const measureCanvas = document.createElement('canvas');
    const context = measureCanvas.getContext('2d') as CanvasRenderingContext2D;
    context.font = `${fontStyle || ''} ${textSize}px ${fontFamily}`;
    return context;
  };
