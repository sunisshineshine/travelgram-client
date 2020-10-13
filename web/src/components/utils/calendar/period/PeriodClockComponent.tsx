import React from "react";
import { getPeriodString } from "../calendarUtils";

import "./PeriodClockComponent.scss";

export const PeriodClockComponent = (props: { period: TimeBased }) => {
  const { period } = props;

  return (
    <div
      id="period-clock-component"
      className="align-items-center"
      onClick={() => {
        console.log(period);
      }}
    >
      <p id="period-clock" className="font-md">
        {getPeriodString({ period, displayClock: true, type: "CLOCK" })}
      </p>
    </div>
  );
};
