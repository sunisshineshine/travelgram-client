import React, { useContext, useState } from "react";
import { deletePlan } from "../../firebase/functions/plans";
import {
  PeriodStringComponent,
  SelectPeriodComponent,
} from "../utils/calendar/PeriodComponents";
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

export const PlanTitleComponent = (props: { plan: Plan }) => {
  const { plan } = props;
  return (
    <div id="plan-title-component">
      <PeriodStringComponent
        period={{ startTime: plan.startTime, endTime: plan.endTime }}
      />
      <h1>{plan.title}</h1>
    </div>
  );
};

export const PlanItemComponent = (props: { planItem: PlanItem }) => {
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
      <h2 id="title">{planItem.title}</h2>
      <p>{planItem.address}</p>
      <div id="event-list">
        {eventItemList.map((eventItem) => {
          return <div>{eventItem.title}</div>;
        })}
        <AddEventItemComponent />
      </div>
    </div>
  );
};

export const EventItemComponent = (props: { eventItem: EventItem }) => {
  return <div>{props.eventItem.title}</div>;
};

export const AddEventItemComponent = (props: { eventItem?: EventItem }) => {
  console.log(props);

  return (
    <div id="add-event-item-component">
      <div className="flex-column">
        <div className="input-form">
          <label>Adding event</label>
          <input />
        </div>
        <SelectPeriodComponent
          size="sm"
          toggleCalendar={true}
          onRangeUpdated={(period) => {
            console.log(period);
          }}
        />
      </div>
    </div>
  );
};
