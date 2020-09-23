import React, { useEffect } from "react";
import * as PATHS from "../../constants/paths";
import * as PLANS from "../../firebase/functions/plans";

export const PlanDetailPage = () => {
  console.log("gello?");
  const urlParams = new URLSearchParams(location.search);

  const planDocId = urlParams.get("id");
  console.log(planDocId);

  if (planDocId == null) {
    window.location.pathname = PATHS.PLANS;
    throw new Error("planDocId is null");
  }

  useEffect(() => {
    PLANS.getPlan(planDocId).then((plan) => console.log(plan));
  }, []);

  //   console.log(location.search);
  //   const { planDocId } = useParams();
  return <div>Plan detail page</div>;
};
