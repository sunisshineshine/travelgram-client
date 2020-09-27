import React, { useEffect, useState } from "react";
import { PlaceSearchBar } from "../../components/places/PlaceSearchBar";
import { PlanItemComponent } from "../../components/plans/plan";
import { PlanTitleComponent } from "../../components/plans/PlanTitleComponent";
import { LoadingModal } from "../../components/utils/LoadingModal";
import * as PATHS from "../../constants/paths";
import * as PLANS from "../../firebase/functions/plans";

export const PlanDetailPage = () => {
  const [title, setTitle] = useState("now loading plan detail...");

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    PLANS.getPlan(planDocId)
      .then((plan) => {
        setLoading(false);
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

  const updatePlanItems = async () => {
    if (!plan) {
      return;
    }
    setLoading(true);
    console.log("plan items will be updated with :" + plan.docId);
    const planItems = await PLANS.getPlanItems(plan.docId);
    console.log(planItems);
    setPlanItems(planItems);
    setLoading(false);
    console.log("plan items updated :");
    console.log(planItems);
  };

  const onPlaceAdded = (placeName: string, placeId: string) => {
    if (!plan) {
      return;
    }
    setLoading(true);
    console.log("place added : " + placeId);
    PLANS.createPlanItem(plan.docId, placeName, placeId)
      .then(() => {
        updatePlanItems();
      })
      .catch((error) => console.error(error));
  };

  const onDeleteButtonClciked = () => {
    if (!plan) {
      return;
    }
    setLoading(true);
    PLANS.deletePlan(plan.docId).then(PATHS.goPlans);
  };

  return (
    <div className="plan-detail-page">
      <LoadingModal loading={loading} />
      <PlanTitleComponent title={title} />
      <button onClick={PATHS.goPlans}>go back to plan select</button>
      <button onClick={onDeleteButtonClciked}>delete this plan</button>
      {planItems.map((planItem, index) => {
        return <PlanItemComponent key={index} planItem={planItem} />;
      })}
      <PlaceSearchBar onAdded={onPlaceAdded} />
    </div>
  );
};
