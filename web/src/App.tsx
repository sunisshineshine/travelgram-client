import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import * as PATHS from "./constants/paths";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

export const App = () => {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path={PATHS.HOME}>
            <Home />
          </Route>
          <Route path={PATHS.LOGIN_PAGE}>
            <Login />
          </Route>
          <Route path={PATHS.SIGN_UP_PAGE}>
            <Signup />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
