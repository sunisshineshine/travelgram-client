import React, { useEffect, useState } from "react";
import { PlanComponent } from "../../components/plans/plan";
import * as PLANS from "../../firebase/functions/plans";
import * as PATHS from "../../constants/paths";
import { TestModal } from "../../components/plans/CreatePlanModal";

export const PlansPage = () => {
  console.log("plans page");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modalVisible, setVisible] = useState(false);
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

  const onCreatePlanButtonClicked = () => {
    setVisible((prev) => !prev);
  };

  const onPlanClicked = (plan: Plan) => {
    console.log("plan clicked");
    if (!plan.docId) {
      console.log("doc id is empty");
      return;
    }
    PATHS.goPlanDetail(plan.docId);
  };

  const onModalClosed = () => {
    setVisible(false);
    updatePlans();
  };

  return (
    <div className="plans">
      <TestModal visible={modalVisible} onClosed={onModalClosed} />
      <p>Please choose your plan</p>
      {plans.map((plan, index) => (
        <PlanComponent key={index} plan={plan} onClick={onPlanClicked} />
      ))}
      <button onClick={onCreatePlanButtonClicked}>create plan</button>
    </div>
  );
};
