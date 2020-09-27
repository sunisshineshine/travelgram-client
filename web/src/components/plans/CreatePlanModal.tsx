import React, { useState } from "react";
import "./CreatePlanModal.css";

import * as PLANS from "../../firebase/functions/plans";
import { CalendarComponent } from "../utils/CalendarComponent";

export const CreatePlanModal = (props: {
  visible: boolean;
  onClosed: () => void;
}) => {
  const [title, setTitle] = useState("");

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const createPlan = () => {
    PLANS.createPlan(title, startTime, endTime)
      .then(() => {
        setTitle("");
        props.onClosed();
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });
  };

  const onStartDateSelected = (date: Date) => {
    console.log("start time has set : " + date);
    setStartTime(date.getTime());
  };

  const onEndDateSelected = (date: Date) => {
    console.log("start time has set : " + date);
    setEndTime(date.getTime());
  };

  return (
    <div
      className="create-plan-modal"
      style={{ display: props.visible ? "block" : "none" }}
    >
      <div className="modal-content">
        <span className="close" onClick={props.onClosed}>
          &times;
        </span>
        <div>
          <label>title : </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p>
            start from :{" "}
            {startTime ? new Date(startTime).toDateString() : undefined}
          </p>
          <p>
            end at : {endTime ? new Date(endTime).toDateString() : undefined}
          </p>
          <button onClick={createPlan}>submit</button>
          <div className="calendar-form row-container">
            <CalendarComponent
              title="start from"
              onDateSelected={onStartDateSelected}
            />
            <CalendarComponent
              title="end at"
              onDateSelected={onEndDateSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
