import React, { useState } from "react";
import { deletePlan } from "../../firebase/functions/plans";
import { LoadingModal } from "../utils/LoadingModal";
import "./plan.css";

export const PlanComponent = (props: {
  plan: Plan;
  onClick: (plan: Plan) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { plan } = props;
  const startDate = plan.startTime && new Date(plan.startTime);
  const endDate = plan.endTime && new Date(plan.endTime);
  const startDateStr = startDate
    ? (startDate.getMonth() + 1).toString() +
      "/" +
      startDate.getDate().toString()
    : null;

  const endDateStr = endDate
    ? (endDate.getMonth() + 1).toString() + "/" + endDate.getDate().toString()
    : null;

  const onDeleteButtonClicked = () => {
    setLoading(true);
    console.log("plan delete button has clicked");
    deletePlan(plan.docId).then(() => {
      setLoading(false);
      window.location.reload();
    });
    return true;
  };

  return (
    <div
      className="plan-component"
      onClick={() => {
        props.onClick(plan);
      }}
    >
      <LoadingModal loading={loading} />
      <div className="date">
        <p>{startDateStr}</p>
        <p>{(startDate || startDateStr) && "~"} </p>
        <p>{endDateStr}</p>
      </div>
      <div className="row-container">
        <p className="title">{props.plan.title}</p>
        <p
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteButtonClicked();
          }}
        >
          delete
        </p>
      </div>
    </div>
  );
};

import "./PlanItemComponent.css";

export const PlanItemComponent = (props: { planItem: PlanItem }) => {
  const { planItem } = props;
  return (
    <div className="plan-item-component" onClick={() => console.log(planItem)}>
      <p className="title">{planItem.title}</p>
      <p>{planItem.address}</p>
    </div>
  );
};
