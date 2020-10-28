import React, { useContext, useState } from "react";
import "./CreatePlanModal.scss";

import * as PLANS from "../../firebase/functions/plans";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";
import { SelectDatePeriodComponent } from "../utils/calendar/period/SelectPeriodComponents";
import { PeriodComponent } from "../utils/calendar/period/PeriodComponents";
import { CancelButton, OkButton } from "../ButtonComponents";

export function CreatePlanModal(props: {
  visible: boolean;
  onClosed: () => void;
}) {
  const [title, setTitle] = useState("");

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const setLoadingState = useContext(LoadingStateContext)![1];

  const createPlan = () => {
    setLoadingState({ activated: true, message: "creating plan" });
    PLANS.createPlan(title, startTime, endTime)
      .then(() => {
        setTitle("");
        setLoadingState({ activated: false });
        props.onClosed();
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });
  };

  const handlePeriodChanged: PeriodCallBack = (time: Period) => {
    setStartTime(time.startTime);
    setEndTime(time.endTime);
  };

  return (
    <div
      id="create-plan-modal"
      style={{ display: props.visible ? "block" : "none" }}
    >
      <div id="modal-content">
        <div id="top-banner">
          <CancelButton
            onClick={() => {
              setTitle("");
              setStartTime(null);
              setEndTime(null);
              props.onClosed();
            }}
          />
          <h3>Create Plan</h3>
          <OkButton onClick={createPlan} />
        </div>

        <div id="title-form" className="input-form">
          <label>YOUR PLAN TITLE</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="...your plan title here"
          />
        </div>

        <div className="time-input">
          <PeriodComponent period={{ startTime, endTime }} />
          <SelectDatePeriodComponent
            title="SET YOUR PLAN PERIOD"
            onPeriodUpdated={handlePeriodChanged}
            selectedPeriod={{ startTime, endTime }}
          />
        </div>
      </div>
    </div>
  );
}
