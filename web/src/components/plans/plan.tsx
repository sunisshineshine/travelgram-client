import React, { useContext } from "react";
import { PlanItemComponent } from "./planItem";
// import { deletePlan } from "../../firebase/functions/plans";
// import { PeriodStringComponent } from "../utils/calendar/period/PeriodComponents";

// import { LoadingStateContext } from "../utils/Loading/LoadingModal";
import "./plan.scss";
import { DeleteButton, EditButton } from "../ButtonComponents";
import { PeriodStringComponent } from "../utils/calendar/period/PeriodComponents";

export function PlanListComponent(props: {
  plans: Plan[];
  onClicked: (plan: Plan) => void;
}) {
  const { plans } = props;
  console.log(plans);

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
  // const setLoadingState = useContext(LoadingStateContext)![1];
  const { plan } = props;
  // const onDeleteButtonClicked = () => {
  //   setLoadingState({ activated: true, message: "plan deleting" });
  //   console.log("plan delete button has clicked");
  //   deletePlan(plan.docId).then(() => {
  //     setLoadingState({ activated: false });
  //     window.location.reload();
  //   });
  //   return true;
  // };

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
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              // onDeleteButtonClicked();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// export const PlanTitleComponent = (props: { plan: Plan }) => {
//   const { plan } = props;
//   return (
//     <div id="plan-title-component">
//       <PeriodStringComponent
//         period={{ startTime: plan.startTime, endTime: plan.endTime }}
//       />
//       <h1>{plan.title}</h1>
//     </div>
//   );
// };
