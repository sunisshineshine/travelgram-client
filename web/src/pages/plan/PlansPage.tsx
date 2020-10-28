import React, { useEffect, useState } from "react";

import { PlanListComponent } from "../../components/plans/plan";
import { CreatePlanModal } from "../../components/plans/CreatePlanModal";

// import "./PlansPage.scss";
import { getPlans } from "../../firebase/functions/plans";
import { goPlanDetail } from "../../constants/paths";

import "./PlansPage.scss";

export const PlansPage = () => {
  console.log(`hello?`);
  const [isDisplayCreateModal, setDisplayCreateModal] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    updatePlans();
  }, []);

  async function updatePlans() {
    const plans = await getPlans().catch((e) => {
      throw e;
    });

    setPlans(plans);
  }

  function handlePlanClicked(plan: Plan) {
    console.log("plan clicked");
    if (!plan.docId) {
      console.log("doc id is empty");
      return;
    }
    goPlanDetail(plan.docId);
  }

  return (
    <div id="plans-page">
      <CreatePlanModal
        visible={isDisplayCreateModal}
        onClosed={() => {
          setDisplayCreateModal(false);
          updatePlans();
        }}
      />
      <h2 id="page-title">Choose your plans</h2>
      <div id="create-button-container">
        <label>...or create</label>
        <button
          className="text-button"
          onClick={() => {
            setDisplayCreateModal(true);
          }}
        >
          NEW PLAN
        </button>
      </div>
      <PlanListComponent onClicked={handlePlanClicked} plans={plans} />

      {/* 
      <p className="title">Please choose your plan</p>
      <PlanListComponent onClicked={onPlanClicked} plans={plans} />
      <button onClick={onCreatePlanButtonClicked}>create plan</button> */}
    </div>
  );
};
