import React, { useEffect, useState } from "react";
import { PlanComponent } from "../../components/plans/plan";
import * as PLANS from "../../firebase/functions/plans";
import * as PATHS from "../../constants/paths";
import { CreatePlanModal } from "../../components/plans/CreatePlanModal";

import "./PlanPage.css";
import { LoadingModal } from "../../components/utils/LoadingModal";

export const PlansPage = () => {
  console.log("plans page");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modalVisible, setVisible] = useState(false);
  useEffect(() => {
    updatePlans();
  }, []);

  const updatePlans = () => {
    setLoading(true);
    PLANS.getPlans()
      .then((plans) => {
        setLoading(false);
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
    <div className="plans-page">
      <LoadingModal loading={loading} />
      <CreatePlanModal visible={modalVisible} onClosed={onModalClosed} />
      <p className="title">Please choose your plan</p>
      <div className="plan-list">
        {plans.map((plan, index) => (
          <PlanComponent key={index} plan={plan} onClick={onPlanClicked} />
        ))}
      </div>
      <button onClick={onCreatePlanButtonClicked}>create plan</button>
    </div>
  );
};
