import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Configs } from './pages/configs/index'
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/">
            <Configs />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
