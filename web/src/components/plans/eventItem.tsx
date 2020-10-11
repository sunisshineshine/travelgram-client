import React, { useState } from "react";
import { createEventItem } from "../../firebase/functions/plans";
import { SelectPeriodComponent } from "../utils/calendar/period/PeriodComponents";

export const EventItemComponent = (props: { eventItem: EventItem }) => {
  return <div>{props.eventItem.content}</div>;
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
