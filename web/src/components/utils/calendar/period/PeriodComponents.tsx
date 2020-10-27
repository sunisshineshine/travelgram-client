import React from "react";
// import { DateStringComponent } from "../DateComponents";
import "./PeriodComponents.scss";

interface PeriodComponentPropTypes {
  period?: TimeBased;
  onStartClicked?: () => void;
  onEndClicked?: () => void;
}

export const PeriodComponent = (props: PeriodComponentPropTypes) => {
  const { period } = props;

  return (
    <div
      id="period-component"
      className="border-primary border-radius flex-row"
    >
      <div
        id="period-start"
        className="border-right-primary"
        onClick={props.onStartClicked}
      >
        <DateStringComponent date={period?.startTime || undefined} />
      </div>
      <div id="period-end" onClick={props.onEndClicked}>
        <DateStringComponent date={period?.endTime || undefined} />
      </div>
    </div>
  );
};

export const PeriodStringComponent = (props: PeriodComponentPropTypes) => {
  const { period } = props;
  if (!period) {
    return (
      <div
        id="period-string-component"
        className="flex-row"
        onClick={props.onStartClicked}
      >
        <p className="icon">📅</p>
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
};
