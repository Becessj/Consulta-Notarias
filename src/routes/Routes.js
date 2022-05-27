import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Consulta from '../pages/Consulta';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route exact path="/dashboard" component={Dashboard}/>
        <Route exact path="/consulta" component={Consulta}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
