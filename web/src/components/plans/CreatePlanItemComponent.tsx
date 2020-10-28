import React, { useContext, useState } from "react";
import "./CreatePlanItemComponent.scss";

import * as PLANS from "../../firebase/functions/plans";

import { PlaceSearchBarComponent } from "../places/PlaceSearchBarComponent";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";
import { getAllDayPeriod } from "../utils/calendar/calendarUtils";
import { SelectPeriodStringComponent } from "../utils/calendar/period/SelectPeriodComponents";

export const CreatePlanItemComponent = (props: {
  plan: Plan;
  onPlanItemAdded: () => void;
}) => {
  const { plan } = props;
  const planPeriod: Period = {
    startTime: plan.startTime,
    endTime: plan.endTime,
  };

  const [selectedPeriod, setSelectedPeriod] = useState(
    planPeriod.startTime
      ? getAllDayPeriod({ time: planPeriod.startTime })
      : undefined
  );
  const onPeriodUpdated: PeriodCallBack = (period: Period) => {
    setSelectedPeriod(period);
  };

  const setLoading = useContext(LoadingStateContext)![1];
  const createPlanItem = (place: google.maps.places.PlaceResult) => {
    setLoading({ activated: true, message: "adding plan" });

    const title = place.name;
    const placeReq: PlaceBased = {
      placeId: place.place_id || null,
      address: place.formatted_address || null,
      lat: ((place.geometry?.location.lat as unknown) as number) || null,
      lng: ((place.geometry?.location.lng as unknown) as number) || null,
    };

    console.log(`place added : ${title}`);
    PLANS.createPlanItem({
      title,
      planDocId: plan.docId,
      timeReq: selectedPeriod || { endTime: null, startTime: null },
      placeReq,
    })
      .then(() => {
        setLoading({ activated: false });
        props.onPlanItemAdded();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div id="create-plan-item-component">
      <SelectPeriodStringComponent
        basePeriod={planPeriod}
        selectedPeriod={selectedPeriod}
        onPeriodUpdated={onPeriodUpdated}
      />
      <PlaceSearchBarComponent onSearched={createPlanItem} />
    </div>
  );
};
