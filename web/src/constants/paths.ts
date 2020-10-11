export const HOME = "/";
export const LOGIN_PAGE = "/pages/login";
export const goLoginPage = () => {
  history.pushState(null, "", LOGIN_PAGE);
  window.location.reload();
};
export const SIGN_UP_PAGE = "/pages/signup";

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
