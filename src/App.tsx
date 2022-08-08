import React from 'react';
import Plan from './containers/plan/Plan';
import './App.css';
import { getInfo } from './api';

// Заглушки
const initProps = getInfo();

const App = () => {
  return (
    <div className="app">
      <Plan plans={initProps} />
    </div>
  );
}

export default App;
