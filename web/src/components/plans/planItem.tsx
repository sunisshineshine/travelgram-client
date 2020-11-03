import React, { useState, useEffect, useContext } from "react";
import { getEventItems } from "../../firebase/functions/plans";
import { DateDividerComponent } from "../utils/calendar/DateDividerComponent";
import { PeriodClockComponent } from "../utils/calendar/period/PeriodComponents";
import { SetLoadingContext } from "../utils/Loading/LoadingModal";
import { AddEventItemComponent, EventItemListComponent } from "./eventItem";
import "./planItem.scss";

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

      if (!startTime || !endTime) {
        if (!startTime && !endTime) {
          datesMap.set(0, [...(datesMap.get(0) || []), planItem]);
          return;
        } else if (startTime) {
          datesMap.set(startTime, [
            ...(datesMap.get(startTime) || []),
            planItem,
          ]);
          datesMap.set(0, [...(datesMap.get(0) || []), planItem]);
          return;
        } else if (endTime) {
          datesMap.set(0, [...(datesMap.get(0) || []), planItem]);
          datesMap.set(endTime, [...(datesMap.get(endTime) || []), planItem]);
          return;
        } else {
          return;
        }
      }

      const startDate = new Date(startTime);
      const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ).getTime();
      const endDate = new Date(endTime);
      const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      ).getTime();

      if (start == end) {
        datesMap.set(start, [...(datesMap.get(start) || []), planItem]);
      } else {
        // plan item will be displayed all within period
        let i = 0;
        while (i < 10) {
          const currentDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + i
          );
          i += 1;

          if (currentDate.getTime() > end) {
            return;
          }

          datesMap.set(currentDate.getTime(), [
            ...(datesMap.get(currentDate.getTime()) || []),
            planItem,
          ]);
        }
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
      {Array.from(dates?.entries() || [])
        .sort()
        .map(([dateTime, planItems]) => {
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

export function PlanItemComponent(props: { planItem: PlanItem }) {
  const { planItem } = props;

  const [eventItems, setEventItems] = useState<EventItem[]>([]);

  const setLoading = useContext(SetLoadingContext)!;
  const updateEvents = () => {
    setLoading({
      activated: true,
      icon: "travel",
      message: "Updating items",
    });

    getEventItems(planItem.docId).then((results) => {
      setLoading({ activated: false });
      setEventItems(results);
    });
  };
  useEffect(() => {
    updateEvents();
  }, []);

  const [isAddEventActivated, setActivated] = useState(false);
  // useEffect(() => {}, [isAddEventActivated]);
  return (
    <div
      id="plan-item-component"
      onMouseEnter={() => {
        setActivated(true);
      }}
      onMouseLeave={() => {
        setActivated(false);
      }}
    >
      <div id="period-container">
        <PeriodClockComponent
          period={{
            startTime: planItem.startTime,
            endTime: planItem.endTime,
          }}
        />
        {/* <SelectClockPeriodComponent
          period={{
            startTime: planItem.startTime,
            endTime: planItem.endTime,
          }}
        /> */}
      </div>
      <div id="plan-item">
        <p className="title">{planItem.title}</p>
        <p className="address">{planItem.address}</p>
        <EventItemListComponent eventItems={eventItems} />
        <AddEventItemComponent
          planItemId={planItem.docId}
          isMouseHover={isAddEventActivated}
          onEventAdded={updateEvents}
        />
      </div>
    </div>
  );
}
