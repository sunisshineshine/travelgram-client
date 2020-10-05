import React, { useContext, useEffect, useState } from "react";
import { PlaceSearchBarComponent } from "../../components/places/PlaceSearchBarComponent";
import {
  PlanItemComponent,
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

  useEffect(() => {
    updatePlanItems();
  }, [plan]);

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

  const onPlaceAdded = (place: google.maps.places.PlaceResult) => {
    if (!plan) {
      return;
    }
    setLoadingState({ activated: true, message: "adding plan" });
    const title = place.name;

    const placeReq: PlaceBased = {
      placeId: place.place_id || null,
      address: place.formatted_address || null,
      lat: ((place.geometry?.location.lat as unknown) as number) || null,
      lng: ((place.geometry?.location.lng as unknown) as number) || null,
    };

    console.log("place added : " + title);
    PLANS.createPlanItem({
      title,
      planDocId: plan.docId,
      timeReq: { endTime: null, startTime: null },
      placeReq,
    })
      .then(() => {
        updatePlanItems();
      })
      .catch((error) => console.error(error));
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

      <div id="plan-item-list">
        {/* case of plan item list is empty */}
        {!planItems[0] && (
          <div>
            this plan doesn't have any item. please search place to add.
          </div>
        )}
        {/* plan item exist */}
        {planItems.map((planItem, index) => {
          return <PlanItemComponent key={index} planItem={planItem} />;
        })}
      </div>

      <PlaceSearchBarComponent onAdded={onPlaceAdded} />
    </div>
  );
};
