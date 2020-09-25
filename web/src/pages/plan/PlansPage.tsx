import React, { useEffect, useState } from "react";
import { PlanComponent } from "../../components/plans/plan";
import * as PLANS from "../../firebase/functions/plans";
import * as PATHS from "../../constants/paths";

export const PlansPage = () => {
  console.log("plans page");
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    updatePlans();
  }, []);

  const updatePlans = () => {
    PLANS.getPlans()
      .then((plans) => {
        setPlans(plans);
        console.log("plan has updated");
        console.log(plans.map((plan) => plan.title));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createPlan = () => {
    PLANS.createPlan("sample")
      .then(() => {
        updatePlans();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onPlanClicked = (plan: Plan) => {
    console.log("plan clicked");
    if (!plan.docId) {
      console.log("doc id is empty");
      return;
    }
    PATHS.goPlanDetail(plan.docId);
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
