import React, { useEffect, useState } from "react";
import { PlaceSearchBar } from "../../components/places/PlaceSearchBar";
import { PlanItemComponent } from "../../components/plans/plan";
import * as PATHS from "../../constants/paths";
import * as PLANS from "../../firebase/functions/plans";

export const PlanDetailPage = () => {
  console.log("plan detail page");
  const [plan, setPlan] = useState<Plan>();
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const urlParams = new URLSearchParams(location.search);
  const planDocId = urlParams.get("id");
  console.log("current selected plan's id" + planDocId);

  if (planDocId == null) {
    window.location.pathname = PATHS.PLANS;
    throw new Error("planDocId is null");
  }

  useEffect(() => {
    updatePlan();
  }, []);

  useEffect(() => {
    updatePlanItems();
  }, [plan]);

  const updatePlan = async () => {
    PLANS.getPlan(planDocId)
      .then((plan) => {
        console.log("plan recieved");
        console.log(plan);
        setPlan(plan);
      })
      .catch((error) => {
        console.error("cannot get plan item from server");
        console.error(error);
        PATHS.goPlans();
      });
  };

  const updatePlanItems = async () => {
    if (!plan) {
      return;
    }
    console.log("plan items will be updated");
    const planItems = await Promise.all(
      plan.planItemIds.map(async (planItemId) => {
        const planItem = await PLANS.getPlanItem(planItemId).catch((error) => {
          console.error(error);
          throw error;
        });
        return planItem;
      })
    );
    setPlanItems(planItems);
    console.log("plan items updated :");
    console.log(planItems);
  };

  const onPlaceAdded = (placeName: string, placeId: string) => {
    if (!plan) {
      return;
    }
    console.log("place added : " + placeId);
    PLANS.createPlanItem(plan.docId, placeName, placeId)
      .then(() => {
        updatePlanItems();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="plan-detail-page">
      <h1> Plan detail page</h1>
      <button onClick={PATHS.goPlans}>go back to plan select</button>
      <h2>{plan && plan.title}</h2>
      {planItems.map((planItem, index) => {
        return <PlanItemComponent key={index} planItem={planItem} />;
      })}
      <PlaceSearchBar onAdded={onPlaceAdded} />
    </div>
  );
};
