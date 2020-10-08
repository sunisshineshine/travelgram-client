import React, { useContext, useEffect, useState } from "react";
import "./CreatePlanItemComponent.scss";

import * as PLANS from "../../firebase/functions/plans";

import { PlaceSearchBarComponent } from "../places/PlaceSearchBarComponent";
import { SelectPeriodComponent } from "../utils/calendar/period/PeriodComponents";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";

export const CreatePlanItemComponent = (props: {
  plan: Plan;
  onPlanItemAdded: () => void;
}) => {
  const { plan } = props;
  const [period, setItemPeriod] = useState<TimeBased>();
  useEffect(() => {
    if (plan.startTime) {
      const startDate = new Date(plan.startTime);
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1
      );
      setItemPeriod({
        startTime: startDate.getTime(),
        endTime: endDate.getTime() - 1,
      });
    }
  }, [plan]);

  const [place, setPlace] = useState<google.maps.places.PlaceResult>();
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

    console.log("place added : " + title);
    PLANS.createPlanItem({
      title,
      planDocId: plan.docId,
      timeReq: period || { endTime: null, startTime: null },
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
      <SelectPeriodComponent
        size="sm"
        selectedRange={period}
        onRangeUpdated={(time) => {
          setItemPeriod(time);
          console.log(time);
        }}
      />
      {place?.name}
      <PlaceSearchBarComponent onSearched={createPlanItem} />
    </div>
  );
};
