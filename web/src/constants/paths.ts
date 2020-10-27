export const HOME_PATH = "/";
export const goHome = () => {
  window.location.pathname = HOME_PATH;
};

export const LOGIN_PATH = "/pages/login";
export const goLoginPage = () => {
  history.pushState(null, "", LOGIN_PATH);
  window.location.reload();
};

export const SIGNUP_PATH = "/pages/signup";
export const goSignUpPage = () => {
  window.location.pathname = SIGNUP_PATH;
};

export const PLANS_PAGE = "/plans";
export const goPlans = () => {
  history.pushState(null, "", PLANS_PAGE);
  window.location.reload();
};

// detail?id=sampleplandocid
export const PLAN_DETAIL_PAGE = "/plans/detail";
export const goPlanDetail = (docId: string) => {
  const url = new URLSearchParams();
  url.set("id", docId);
  const params = url.toString();
  history.pushState(null, "", PLAN_DETAIL_PAGE + "?" + params);
  window.location.reload();
};
