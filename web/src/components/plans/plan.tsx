import React, { useContext, useEffect, useState } from "react";
import {
  createEventItem,
  deletePlan,
  getEventItems,
} from "../../firebase/functions/plans";
import { DateDividerComponent } from "../utils/calendar/DateDividerComponent";
import { PeriodClockComponent } from "../utils/calendar/period/PeriodClockComponent";
import {
  PeriodStringComponent,
  SelectPeriodComponent,
} from "../utils/calendar/period/PeriodComponents";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";
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

export const PlanItemListComponent = (props: {
  plan: Plan;
  planItems: PlanItem[];
}) => {
  const { plan, planItems } = props;
  const [dates, setDates] = useState<Map<number, PlanItem[]>>();
  useEffect(() => {
    const datesMap = new Map<number, PlanItem[]>();
    planItems.map((planItem) => {
      const { startTime, endTime } = planItem;
      const startDate = new Date(startTime || 0);

      const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ).getTime();
      const endDate = new Date(endTime || 0);
      const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      ).getTime();

      if (start == end) {
        datesMap.set(start, [...(datesMap.get(start) || []), planItem]);
      } else {
        // plan item will be displayed both start and end date
        datesMap.set(start, [...(datesMap.get(start) || []), planItem]);
        datesMap.set(end, [...(datesMap.get(end) || []), planItem]);
      }
    });
    setDates(datesMap);
  }, [planItems]);

  return (
    <div id="plan-item-list-component">
      {/* case of plan item list is empty */}
      {(!planItems[0] || !dates) && (
        <div>this plan doesn't have any item. please search place to add.</div>
      )}
      {/* plan item exist */}
      {Array.from(dates?.entries() || []).map(([dateTime, planItems]) => {
        return (
          <div id="period-items-group">
            <DateDividerComponent
              base={plan.startTime ? new Date(plan.startTime) : undefined}
              date={new Date(dateTime)}
            />
            {planItems.map((planItem, index) => {
              return <PlanItemComponent key={index} planItem={planItem} />;
            })}
          </div>
        );
      })}
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
    <div
      id="plan-item-component"
      onMouseEnter={() => {
        console.error("mouse over");
      }}
    >
      <div className="flex-row">
        <PeriodClockComponent
          period={{
            startTime: planItem.startTime,
            endTime: planItem.startTime,
          }}
        />
        <div id="plan-item">
          <h2 id="title">{planItem.title}</h2>
          <p>{planItem.address}</p>
          <div id="event-list">
            {eventItems.map((eventItem) => {
              return <div>{eventItem.title}</div>;
            })}
            {/* <AddEventItemComponent planItemId={planItem.docId} /> */}
          </div>
        </div>
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
