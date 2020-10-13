import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./style/_theme.scss";
import "./style/classes/_font.scss";
import "./App.scss";

import * as PATHS from "./constants/paths";
import { PlansPage } from "./pages/plan/PlansPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { PlanDetailPage } from "./pages/plan/PlanDetailPage";
import { User } from "firebase";
import { getAuthUser } from "./firebase/auth";
import { TopBannerComponent } from "./components/banners/TopBannerComponent";
import {
  LoadingContextProvider,
  LoadingModalComponent,
  LoadingStateContext,
} from "./components/utils/Loading/LoadingModal";
import {
  NavigationnComponent as NavigationComponent,
  NavItemsContextProvider,
} from "./components/utils/Navigation";
export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    setLoading(true);
    getAuthUser()
      .then((user) => setUser(user))
      .then(() => setLoading(false));
  }, []);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      setLoadingState({
        activated: true,
        icon: "auth",
        message: "now getting user information",
      });
    } else {
      setLoadingState({ activated: false });
    }
  }, [loading]);
  const setLoadingState = useContext(LoadingStateContext)![1];

  return (
    <div className="app">
      <LoadingModalComponent />
      <TopBannerComponent />
      <NavigationComponent />
      {!loading && (
        <div className="main-content-page">
          <Router>
            <Switch>
              {user && <Route path="not-exist-path">test</Route>}
              <Route path={PATHS.LOGIN_PAGE}>
                <LoginPage />
              </Route>
              <Route path={PATHS.SIGN_UP_PAGE}>
                <SignupPage />
              </Route>
              {user && (
                <Route exact path={PATHS.PLANS_PAGE}>
                  <PlansPage />
                </Route>
              )}
              {user && (
                <Route exact path={PATHS.PLAN_DETAIL_PAGE}>
                  <PlanDetailPage />
                </Route>
              )}
              <Route>
                {() => {
                  PATHS.goLoginPage();
                }}
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
};

export const ContextProviders = (props: { children: React.ReactNode }) => {
  return (
    <>
      <NavItemsContextProvider>
        <LoadingContextProvider>{props.children}</LoadingContextProvider>
      </NavItemsContextProvider>
    </>
  );
};
