import React from 'react';
import Plan from './containers/plan/Plan';
import logo from './logo.svg';
import './App.css';

//TODO Заглушки
const markers = [
  {
      x: 624.913146972656,
      y: 171.780319213867,
  },
  {
    x: 728.039978027344,
    y: 171.780319213867,
  },
  {
    x: 681.164123535156,
    y: 303.032592773438,
  },
  {
    x: 599.912719726563,
    y: 371.783782958984,
  }
]
const planUrl = '/mock/plan-1.jpg';
const planName = '15 этаж';
const planId = '624b2a55eebff930f48704e5';

function App() {
  return (
    <div className="app">
      {/* <img src="/mock/plan-1.jpg"></img> */}
      <Plan planId={planId} planUrl={planUrl} planName={planName} markers={markers} />
    </div>
  );
}

export default App;
