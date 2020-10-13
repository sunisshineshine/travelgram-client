import React, { useContext, useEffect, useState } from "react";
import { CreatePlanItemComponent } from "../../components/plans/CreatePlanItemComponent";
import { PlanTitleComponent } from "../../components/plans/plan";
import { PlanItemListComponent } from "../../components/plans/planItem";
import { LoadingStateContext } from "../../components/utils/Loading/LoadingModal";
import * as PATHS from "../../constants/paths";
import * as PLANS from "../../firebase/functions/plans";

import "./PlanDetailPage.scss";

export const PlanDetailPage = () => {
  const [title, setTitle] = useState("now loading plan detail...");

  const setLoadingState = useContext(LoadingStateContext)![1];

  const [plan, setPlan] = useState<Plan>();
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  // getting plan
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const planDocId = urlParams.get("id");
    console.log("current selected plan's id" + planDocId);
    if (planDocId == null) {
      window.location.pathname = PATHS.PLANS_PAGE;
      throw new Error("planDocId is null");
    }
    updatePlan(planDocId);
  }, []);

  const updatePlan = async (planDocId: string) => {
    setLoadingState({ activated: true, message: "getting plan detail" });
    PLANS.getPlan(planDocId)
      .then((plan) => {
        setLoadingState({ activated: false });
        console.log("plan recieved", plan);
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
    setPlanItems(planItems);
    setLoadingState({ activated: false });
    console.log("plan items updated", planItems);
  };

  if (!plan) {
    return <div>getting plan data from server</div>;
  }

  return (
    <div id="plan-detail-page">
      <PlanTitleComponent plan={plan} />
      <div className="border-primary border-radius">
        <PlanItemListComponent plan={plan} planItems={planItems} />
        {plan && (
          <CreatePlanItemComponent
            plan={plan}
            onPlanItemAdded={updatePlanItems}
          />
        )}
      </div>
    </div>
  );
};
