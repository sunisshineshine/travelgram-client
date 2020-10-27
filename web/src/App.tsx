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
import { LoadingContextProvider } from "./components/utils/Loading/LoadingModal";
import { UserStateComponent } from "./components/auth/UserStateComponent";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  HOME_PATH,
  LOGIN_PATH,
  PLANS_PAGE,
  SIGNUP_PATH,
} from "./constants/paths";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { PlansPage } from "./pages/plan/PlansPage";
// import "./style/style.scss";

export function App() {
  // const [user, setUser] = useState<User | null>(null);
  // useEffect(() => {
  //   setLoading(true);
  //   getAuthUser()
  //     .then((user) => setUser(user))
  //     .then(() => setLoading(false));
  // }, []);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   if (loading) {
  //     setLoadingState({
  //       activated: true,
  //       icon: "auth",
  //       message: "now getting user information",
  //     });
  //   } else {
  //     setLoadingState({ activated: false });
  //   }
  // }, [loading]);
  // const setLoadingState = useContext(LoadingStateContext)![1];

  return (
    <div id="app">
      <div id="side-container">
        <TitleComponent />
        <UserStateComponent />
        <NavigatorComponent />
      </div>
      <div id="content-container">
        <BrowserRouter>
          <Switch>
            <Route path={LOGIN_PATH}>
              <LoginPage />
            </Route>
            <Route path={SIGNUP_PATH}>
              <SignupPage />
            </Route>
            <Route path={HOME_PATH || PLANS_PAGE}>
              <PlansPage />
            </Route>
          </Switch>
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
