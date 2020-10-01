import React, { useContext, useState } from "react";
import { deletePlan, updatePlanItem } from "../../firebase/functions/plans";
import { DateComponent } from "../utils/DateComponent";
import { InputStringModal } from "../utils/InputStringModal";
import { LoadingStateContext } from "../utils/LoadingModal";
import "./plan.css";

export const PlanListComponent = (props: {
  plans: Plan[];
  onClicked: (plan: Plan) => void;
}) => {
  const { plans } = props;
  return (
    <div className="plan-list">
      {plans.map((plan, index) => (
        <PlanComponent key={index} plan={plan} onClick={props.onClicked} />
      ))}
    </div>
  );
};

export const PlanComponent = (props: {
  plan: Plan;
  onClick: (plan: Plan) => void;
}) => {
  const setLoadingState = useContext(LoadingStateContext)![1];
  const { plan } = props;
  const onDeleteButtonClicked = () => {
    setLoadingState({ activated: true, message: "plan deleting" });
    console.log("plan delete button has clicked");
    deletePlan(plan.docId).then(() => {
      setLoadingState({ activated: false });
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
      <DateComponent
        time={{ endTime: plan.endTime, startTime: plan.startTime }}
      />
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
  const [changingTitle, setChangingTitle] = useState(false);
  const { planItem } = props;
  return (
    <div className="plan-item-component">
      {/* title change modal */}
      <InputStringModal
        activated={changingTitle}
        title="changing title "
        placeholder={planItem.title}
        onCall={(input) => {
          const item = planItem;
          item.title = input;
          updatePlanItem({ planItem: item }).then(() => {
            window.location.reload();
          });
        }}
      />
      <p className="title" onClick={() => setChangingTitle(true)}>
        {planItem.title}
      </p>
      <p>{planItem.address}</p>
    </div>
  );
};
