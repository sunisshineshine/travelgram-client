import React, { useContext, useState } from "react";
import "./CreatePlanModal.scss";

import * as PLANS from "../../firebase/functions/plans";
import { CalendarSelectRangeComponent } from "../utils/calendar/CalendarComponent";
import { LoadingStateContext } from "../utils/LoadingModal";

export const CreatePlanModal = (props: {
  visible: boolean;
  onClosed: () => void;
}) => {
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

  const onRangeChanged: TimebasedCallBack = (time: TimeBased) => {
    console.log(time);
    setStartTime(time.startTime);
    setEndTime(time.endTime);
  };

  return (
    <div
      className="create-plan-modal"
      style={{ display: props.visible ? "block" : "none" }}
    >
      <div className="modal-content flex-column border-radius">
        <div id="top-bar" className="align-center">
          <p id="title" className="font-bold">
            CRATING PLAN HERE
          </p>
        </div>
        <div className="flex-row justify-content-space-between">
          <div className="close-button" onClick={props.onClosed} />
          <div onClick={createPlan}>OK</div>
        </div>

        <div id="title-input">
          <div className="input-form">
            <label>YOUR PLAN TITLE</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="...your plan title here"
            />
          </div>
        </div>

        <div className="time-input">
          <CalendarSelectRangeComponent
            title="SELECT YOUR TRAVEL PERIOD"
            onRangeUpdated={onRangeChanged}
          />
        </div>
      </div>
    </div>
  );
};
