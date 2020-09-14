import * as PATHS from "./constants/paths";

export const goHome = () => {
  window.location.pathname = PATHS.HOME;
};

export const goLoginPage = () => {
  window.location.pathname = PATHS.LOGIN_PAGE;
};

export const goSignUpPage = () => {
  window.location.pathname = PATHS.SIGN_UP_PAGE;
};
