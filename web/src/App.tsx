import React, { useContext, useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import * as PATHS from "./constants/paths";
// import { PlansPage } from "./pages/plan/PlansPage";

// import { LoginPage } from "./pages/auth/LoginPage";
// import { SignupPage } from "./pages/auth/SignupPage";
// import { PlanDetailPage } from "./pages/plan/PlanDetailPage";
// import { User } from "firebase";
// import { getAuthUser } from "./firebase/auth";
// import { TopBannerComponent } from "./components/banners/TopBannerComponent";
// import {
//   LoadingContextProvider,
//   LoadingModalComponent,
//   LoadingStateContext,
// } from "./components/utils/Loading/LoadingModal";
// import {
//   NavigationnComponent as NavigationComponent,
//   NavItemsContextProvider,
// } from "./components/utils/Navigation";

import "./style/classes/_classes.scss";
import "./App.scss";
import { NavigatorComponent } from "./components/utils/NavigatorComponent";
import {
  LoadingContextProvider,
  LoadingModalComponent,
  SetLoadingContext,
} from "./components/utils/Loading/LoadingModal";
import { UserStateComponent } from "./components/auth/UserStateComponent";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  goLoginPage,
  goPlans,
  HOME_PATH,
  LOGIN_PATH,
  PLANS_PAGE,
  PLAN_DETAIL_PAGE,
  SIGNUP_PATH,
} from "./constants/paths";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { PlansPage } from "./pages/plan/PlansPage";
import { PlanDetailPage } from "./pages/plan/PlanDetailPage";
import { User } from "firebase";
import { getAuthUser } from "./firebase/auth";
// import "./style/style.scss";

export function App() {
  const setLoading = useContext(SetLoadingContext)!;
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (location.pathname == HOME_PATH) {
      goPlans();
    }
    updateUser();
  }, []);

  async function updateUser() {
    setLoading({
      activated: true,
      icon: "auth",
      message: "Getting user state",
    });

    const user = await getAuthUser();

    setLoading({
      activated: false,
    });

    function isUserNotExist(u: User | null): boolean {
      return !u;
    }

    function isAuthPath(): boolean {
      return (
        location.pathname != LOGIN_PATH && location.pathname != SIGNUP_PATH
      );
    }

    if (isUserNotExist(user) && isAuthPath()) {
      goLoginPage();
      return;
    }

    setUser(user);
  }

  return (
    <div id="app">
      <LoadingModalComponent />
      <div id="side-container">
        <TitleComponent />
        <UserStateComponent />
        <NavigatorComponent />
      </div>
      <div id="content-container">
        <BrowserRouter>
          <div id="pages-container">
            <Switch>
              <Route path={LOGIN_PATH}>
                <LoginPage />
              </Route>
              <Route path={SIGNUP_PATH}>
                <SignupPage />
              </Route>
              {user && (
                <>
                  <Route exact path={PLANS_PAGE}>
                    <PlansPage />
                  </Route>
                  <Route exact path={PLAN_DETAIL_PAGE}>
                    <PlanDetailPage />
                  </Route>
                </>
              )}
              <Route>
                <h3>Loading...</h3>
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
      {/* <LoadingModalComponent />
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
      )} */}
    </div>
  );
}

function TitleComponent() {
  return <h1 id="main-title">YOGURTRAVEL</h1>;
}

export const ContextProviders = (props: { children: React.ReactNode }) => {
  return (
    <>
      {/* <NavItemsContextProvider> */}
      <LoadingContextProvider>{props.children}</LoadingContextProvider>
      {/* </NavItemsContextProvider> */}
    </>
  );
};
