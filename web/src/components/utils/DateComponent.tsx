import React from "react";
import "./DateComponent.css";

export const DateComponent = (props: { time: TimeBased }) => {
  const { time } = props;

  const startDate = time.startTime && new Date(time.startTime);
  const endDate = time.endTime && new Date(time.endTime);
  const startDateStr = startDate
    ? (startDate.getMonth() + 1).toString() +
      "/" +
      startDate.getDate().toString()
    : null;

  const endDateStr = endDate
    ? (endDate.getMonth() + 1).toString() + "/" + endDate.getDate().toString()
    : null;

  return (
    <div className="date-component">
      <p>{startDateStr}</p>
      <p>{(startDate || startDateStr) && "~"} </p>
      <p>{endDateStr}</p>
    </div>
  );
};
