import React, { useContext, useState } from "react";
import { deletePlan, updatePlanItem } from "../../firebase/functions/plans";
import { PeriodStringComponent } from "../utils/calendar/PeriodComponents";
import { InputStringModal } from "../utils/InputStringModal";
import { LoadingStateContext } from "../utils/LoadingModal";
import "./plan.scss";

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
      id="plan-component"
      onClick={() => {
        props.onClick(plan);
      }}
    >
      <PeriodStringComponent
        period={{ endTime: plan.endTime, startTime: plan.startTime }}
      />
      <div id="content" className="flex-row border-radius-sm border-primary">
        <p id="title" className="font-title">
          {props.plan.title}
        </p>
        <p
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteButtonClicked();
          }}
        >
          ❌
        </p>
      </div>
    </div>
  );
};

import "./PlanItemComponent.css";

export const PlanItemComponent = (props: { planItem: PlanItem }) => {
  const [changingTitle, setChangingTitle] = useState(false);
  const { planItem } = props;

  const eventItemList: EventItem[] = [
    {
      docId: "",
      endTime: 0,
      startTime: 0,
      planItemDocId: "",
      title: "event temt",
    },
    {
      docId: "",
      endTime: 0,
      startTime: 0,
      planItemDocId: "",
      title: "event temt",
    },
    {
      docId: "",
      endTime: 0,
      startTime: 0,
      planItemDocId: "",
      title: "event temt",
    },
    {
      docId: "",
      endTime: 0,
      startTime: 0,
      planItemDocId: "",
      title: "event temt",
    },
    {
      docId: "",
      endTime: 0,
      startTime: 0,
      planItemDocId: "",
      title: "event temt",
    },
  ];
  return (
    <div id="plan-item-component">
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
      {eventItemList.map((eventItem) => {
        return <div>{eventItem.title}</div>;
      })}
    </div>
  );
};

interface EventItem extends FirebaseDocumentObject, TimeBased {
  planItemDocId: string;
  title: string;
}

export const EventItemComponent = (props: { eventItem: EventItem }) => {
  return <div>{props.eventItem.title}</div>;
};
