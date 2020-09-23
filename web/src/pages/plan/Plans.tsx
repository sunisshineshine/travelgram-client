import React, { useEffect, useState } from "react";
import { PlanComponent } from "../../components/plans/plan";
import * as PLANS from "../../firebase/functions/plans";
import * as PATHS from "../../constants/paths";

export const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    PLANS.getPlans().then((plans) => {
      setPlans(plans);
      console.log(plans);
    });
  }, []);

  const onPlanClicked = (plan: Plan) => {
    if (!plan.docId) {
      console.log("doc id is empty");
      return;
    }
    console.log(plan);
    PATHS.goPlanDetail(plan.docId);
  };

  const createPlan = () => {
    PLANS.createPlan("sample");
  };

  return (
    <div className="plans">
      <p>Please choose your plan</p>
      {plans.map((plan, index) => (
        <PlanComponent key={index} plan={plan} onClick={onPlanClicked} />
      ))}
      <button onClick={createPlan}>create plan</button>
    </div>
  );
};
