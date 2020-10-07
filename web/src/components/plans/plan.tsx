import React, { useContext, useEffect, useState } from "react";
import {
  createEventItem,
  deletePlan,
  getEventItems,
} from "../../firebase/functions/plans";
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

  const [eventItems, setEventItems] = useState<EventItem[]>([]);

  useEffect(() => {
    getEventItems(planItem.docId).then((results) => {
      setEventItems(results);
    });
  }, []);
  return (
    <div id="plan-item-component">
      <h2 id="title">{planItem.title}</h2>
      <p>{planItem.address}</p>
      <div id="event-list">
        {eventItems.map((eventItem) => {
          return <div>{eventItem.title}</div>;
        })}
        {/* <AddEventItemComponent planItemId={planItem.docId} /> */}
      </div>
    </div>
  );
};

export const EventItemComponent = (props: { eventItem: EventItem }) => {
  return <div>{props.eventItem.title}</div>;
};

export const AddEventItemComponent = (props: {
  planItemId: string;
  eventItem?: EventItem;
}) => {
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<TimeBased>({
    endTime: null,
    startTime: null,
  });

  const onSubmit = () => {
    createEventItem({ period, planItemId: props.planItemId, title }).then(
      (result) => {
        console.log(result);
      }
    );
  };

  return (
    <div id="add-event-item-component">
      <div className="flex-column">
        <div className="input-form">
          <label>Adding event</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={onSubmit}>submit</button>
        </div>
        <SelectPeriodComponent
          size="sm"
          onRangeUpdated={(period) => {
            setPeriod(period);
          }}
        />
      </div>
    </div>
  );
};
