import React from "react";
import { CalendarIcon } from "../../../Icons";
import { getPeriodString } from "../calendarUtils";
import { DateStringComponent } from "../DateComponents";
// import { DateStringComponent } from "../DateComponents";
import "./PeriodComponents.scss";

interface PeriodComponentPropTypes {
  period?: Period;
  onStartClicked?: () => void;
  onEndClicked?: () => void;
}

export function PeriodComponent(props: PeriodComponentPropTypes) {
  const { period } = props;

  return (
    <div id="period-component">
      <div
        id="period-start"
        className="border-right-primary"
        onClick={props.onStartClicked}
      >
        <DateStringComponent date={period?.startTime || undefined} />
      </div>
      <div className="divider"></div>
      <div id="period-end" onClick={props.onEndClicked}>
        <DateStringComponent date={period?.endTime || undefined} />
      </div>
    </div>
  );
}

export function PeriodStringComponent(props: PeriodComponentPropTypes) {
  const { period } = props;
  if (!period) {
    return (
      <div
        id="period-string-component"
        className="flex-row"
        onClick={props.onStartClicked}
      >
        <CalendarIcon />
        <p>period not selected</p>
      </div>
    );
  }

  const startDate = period.startTime && new Date(period.startTime);
  const endDate = period.endTime && new Date(period.endTime);
  const startDateStr = startDate
    ? (startDate.getMonth() + 1).toString() +
      "/" +
      startDate.getDate().toString()
    : "not selected";

  const endDateStr = endDate
    ? (endDate.getMonth() + 1).toString() + "/" + endDate.getDate().toString()
    : "not selected";

  return (
    <div id="period-string-component">
      <p id="calendar-icon">📅</p>
      <div
        id="period-string"
        style={{ marginLeft: "5px", height: "fit-content" }}
      >
        {startDateStr === endDateStr ? (
          <p onClick={props.onStartClicked}>{startDateStr}</p>
        ) : (
          <>
            <p onClick={props.onStartClicked}>{startDateStr}</p>
            <p>{(startDate || startDateStr) && "~"} </p>
            <p onClick={props.onEndClicked}>{endDateStr}</p>
          </>
        )}
      </div>
    </div>
  );
}

export function PeriodClockComponent(props: { period: Period }) {
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
}
