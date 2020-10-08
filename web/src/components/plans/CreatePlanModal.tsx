import React, { useContext, useState } from "react";
import "./CreatePlanModal.scss";

import * as PLANS from "../../firebase/functions/plans";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";
import { SelectPeriodComponent } from "../utils/calendar/PeriodComponents";

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
          <p id="title" className="font-bold color-gray">
            CRATING PLAN HERE
          </p>
        </div>
        <div className="flex-row justify-content-space-between">
          <div className="close-button" onClick={props.onClosed}>
            🗙
          </div>
          <div className="done-button" onClick={createPlan}>
            ✔
          </div>
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
          <SelectPeriodComponent
            title="SET YOUR PLAN PERIOD"
            onRangeUpdated={onRangeChanged}
          />
        </div>
      </div>
    </div>
  );
};
