import React from 'react';
import Plan from './containers/plan/Plan';
import logo from './logo.svg';
import './App.css';
import { getInfo } from './api';

//TODO Заглушки
const initProps = getInfo();

function App() {
  // React.useEffect(() => {
  //   getInfo();
  // }, [])
  return (
    <div className="app">
      <Plan plans={initProps} />
    </div>
  );
}

export default App;
