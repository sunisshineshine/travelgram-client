import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

import * as PATHS from "./constants/paths";
import { PlansPage } from "./pages/plan/PlansPage";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { PlanDetailPage } from "./pages/plan/PlanDetailPage";
import { User } from "firebase";
import { getAuthUser } from "./firebase/auth";
import { TopBanner } from "./components/banners/TopBanner";
import { goLoginPage } from "./navigator";
import { LoadingModal } from "./components/utils/LoadingModal";
export const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getAuthUser()
      .then((user) => {
        setLoading(false);
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  return (
    <div className="app">
      <LoadingModal loading={loading} />
      <TopBanner />
      <div className="main-content-page">
        <Router>
          <Switch>
            <Route path={PATHS.LOGIN_PAGE}>
              <LoginPage />
            </Route>
            <Route path={PATHS.SIGN_UP_PAGE}>
              <SignupPage />
            </Route>
            {user && (
              <>
                <Route exact path={PATHS.HOME}>
                  <HomePage />
                </Route>
                <Route exact path={PATHS.PLANS}>
                  <PlansPage />
                </Route>
                <Route path={PATHS.PLAN_DETAIL}>
                  <PlanDetailPage />
                </Route>
              </>
            )}
            <Route>
              <div>
                <button onClick={goLoginPage}> go to login page</button>
              </div>
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
};
