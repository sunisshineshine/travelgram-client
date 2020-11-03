import React, { useContext } from "react";
// import { deletePlan } from "../../firebase/functions/plans";
// import { PeriodStringComponent } from "../utils/calendar/period/PeriodComponents";

// import { LoadingStateContext } from "../utils/Loading/LoadingModal";
import "./plan.scss";
import { CancelButton, EditButton } from "../ButtonComponents";
import { PeriodStringComponent } from "../utils/calendar/period/PeriodComponents";
import { SetLoadingContext } from "../utils/Loading/LoadingModal";
import { deletePlan } from "../../firebase/functions/plans";

export function PlanListComponent(props: {
  plans: Plan[];
  onClicked: (plan: Plan) => void;
}) {
  const { plans } = props;

  return (
    <div id="plan-list-component">
      {plans.map((plan) => (
        <PlanComponent
          key={Math.random()}
          plan={plan}
          onClick={props.onClicked}
        />
      ))}
      {/* {plans.map((plan, index) => (
        // <PlanComponent key={index} plan={plan} onClick={props.onClicked} />
      ))} */}
    </div>
  );
}

export function PlanComponent(props: {
  plan: Plan;
  onClick: (plan: Plan) => void;
}) {
  const { plan } = props;

  const setLoading = useContext(SetLoadingContext)!;

  const handleDeleteButtonClicked = () => {
    setLoading({ activated: true, message: "plan deleting" });
    console.log("plan delete button has clicked");
    deletePlan(plan.docId).then(() => {
      setLoading({ activated: false });
      window.location.reload();
    });
    return true;
  };

  return (
    <div
      id="plan-component"
      onClick={() => {
        props.onClick(plan);
      }}
    >
      <PeriodStringComponent
        period={{ endTime: plan.endTime, startTime: plan.startTime }}
      />
      <div id="plan-container">
        <h3 id="plan-title" className="font-title">
          {props.plan.title}
        </h3>
        <div id="action-buttons">
          <EditButton onClick={() => console.log(`edit button clicked`)} />
          <CancelButton
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteButtonClicked();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const PlanTitleComponent = (props: { plan: Plan }) => {
  const { plan } = props;
  return (
    <div id="plan-title-component">
      <PeriodStringComponent
        period={{ startTime: plan.startTime, endTime: plan.endTime }}
      />
      <h2>{plan.title}</h2>
    </div>
  );
};
