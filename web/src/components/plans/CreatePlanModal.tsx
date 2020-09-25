import React, { useState } from "react";
import "./CreatePlanModal.css";

import * as PLANS from "../../firebase/functions/plans";

export const TestModal = (props: {
  visible: boolean;
  onClosed: () => void;
}) => {
  const [title, setTitle] = useState("");

  const createPlan = () => {
    PLANS.createPlan(title)
      .then(() => {
        setTitle("");
        props.onClosed();
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });
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
          <button onClick={createPlan}>submit</button>
        </div>
      </div>
    </div>
  );
};
