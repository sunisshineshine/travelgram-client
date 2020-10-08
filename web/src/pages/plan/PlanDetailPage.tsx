import React, { useContext, useEffect, useState } from "react";
import { CreatePlanItemComponent } from "../../components/plans/CreatePlanItemComponent";
import {
  PlanItemComponent,
  PlanItemListComponent,
  PlanTitleComponent,
} from "../../components/plans/plan";
import { LoadingStateContext } from "../../components/utils/LoadingModal";
import * as PATHS from "../../constants/paths";
import * as PLANS from "../../firebase/functions/plans";

import "./PlanDetailPage.scss";

export const PlanDetailPage = () => {
  const [title, setTitle] = useState("now loading plan detail...");

  console.log(title);
  const setLoadingState = useContext(LoadingStateContext)![1];

  const [plan, setPlan] = useState<Plan>();
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  // getting plan
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const planDocId = urlParams.get("id");
    console.log("current selected plan's id" + planDocId);
    if (planDocId == null) {
      window.location.pathname = PATHS.PLANS;
      throw new Error("planDocId is null");
    }
    updatePlan(planDocId);
  }, []);

  const updatePlan = async (planDocId: string) => {
    setLoadingState({ activated: true, message: "getting plan detail" });
    PLANS.getPlan(planDocId)
      .then((plan) => {
        setLoadingState({ activated: false });
        console.log("plan recieved");
        console.log(plan);
        setTitle(plan.title);
        setPlan(plan);
      })
      .catch((error) => {
        console.error("cannot get plan item from server");
        console.error(error);
        PATHS.goPlans();
      });
  };

  // getting planitems from plan
  useEffect(() => {
    updatePlanItems();
  }, [plan]);

  const updatePlanItems = async () => {
    if (!plan) {
      return;
    }
    setLoadingState({ activated: true, message: "updating plan Items" });
    console.log("plan items will be updated with :" + plan.docId);
    const planItems = await PLANS.getPlanItems(plan.docId);
    console.log(planItems);
    setPlanItems(planItems);
    setLoadingState({ activated: false });
    console.log("plan items updated :");
    console.log(planItems);
  };

  const onDeleteButtonClciked = () => {
    if (!plan) {
      return;
    }
    setLoadingState({ activated: true, message: "now deleting plan" });
    PLANS.deletePlan(plan.docId).then(PATHS.goPlans);
  };

  if (!plan) {
    return <div>getting plan data from server</div>;
  }

  return (
    <div id="plan-detail-page" className="border-primary border-radius">
      <PlanTitleComponent plan={plan} />
      <button onClick={PATHS.goPlans}>go back to plan select</button>
      <button onClick={onDeleteButtonClciked}>delete this plan</button>
      <PlanItemListComponent planItems={planItems} />

      {plan && (
        <CreatePlanItemComponent
          plan={plan}
          onPlanItemAdded={updatePlanItems}
        />
      )}
    </div>
  );
};
