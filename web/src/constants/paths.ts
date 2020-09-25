export const HOME = "/";
export const LOGIN_PAGE = "/pages/login";
export const SIGN_UP_PAGE = "/pages/signup";

export const PLANS = "/plans";
export const goPlans = () => {
  history.pushState(null, "", PLANS);
  window.location.reload();
};

// detail?id=sampleplandocid
export const PLAN_DETAIL = "/plans/detail";
export const goPlanDetail = (docId: string) => {
  const url = new URLSearchParams();
  url.set("id", docId);
  const params = url.toString();
  history.pushState(null, "", PLAN_DETAIL + "?" + params);
  window.location.reload();
};
