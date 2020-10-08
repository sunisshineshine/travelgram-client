import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./style/_theme.scss";
import "./App.scss";

import * as PATHS from "./constants/paths";
import { PlansPage } from "./pages/plan/PlansPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { PlanDetailPage } from "./pages/plan/PlanDetailPage";
import { User } from "firebase";
import { getAuthUser } from "./firebase/auth";
import { TopBannerComponent } from "./components/banners/TopBannerComponent";
import { goLoginPage } from "./navigator";
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
  const setLoadingState = useContext(LoadingStateContext)![1];
  useEffect(() => {
    setLoadingState({
      activated: true,
      icon: "auth",
      message: "now getting user information",
    });
    getAuthUser()
      .then((user) => {
        setLoadingState({ activated: false });
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="app">
      <LoadingModalComponent />
      <TopBannerComponent />
      <NavigationComponent />
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

export const ContextProviders = (props: { children: React.ReactNode }) => {
  return (
    <>
      <NavItemsContextProvider>
        <LoadingContextProvider>{props.children}</LoadingContextProvider>
      </NavItemsContextProvider>
    </>
  );
};
