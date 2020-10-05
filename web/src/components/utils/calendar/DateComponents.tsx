import React from "react";

import "./DateComponents.scss";

export const DateComponent = (props: {
  date: Date;
  isSelected: boolean;
  isToday?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  isDisabled?: boolean;
  onClcicked: DateCallBack;
}) => {
  let className = "";
  if (props.isSelected) {
    className += " selected";
  }
  if (props.isToday) {
    className += " today";
  }
  if (props.isStart) {
    className += " start";
  }
  if (props.isEnd) {
    className += " end";
  }
  if (props.isDisabled) {
    className += " disabled";
  }

  return (
    <div
      id="date-component"
      onClick={() => {
        props.onClcicked(props.date);
      }}
    >
      <div className={className}>
        <p className="align-center">{props.date.getDate()}</p>
      </div>
    </div>
  );
};

export const DateStringComponent = (props: { date?: Date | number }) => {
  const date =
    typeof props.date === "number" ? new Date(props.date) : props.date;

  return (
    <div
      id="date-string-component"
      className="flex-row align-items-center justify-content-center"
    >
      <div className="icon">📅</div>
      <div id="date-string" className="font-size-lg">
        {date ? (
          <p>
            {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
          </p>
        ) : (
          <div>not selected</div>
        )}
      </div>
    </div>
  );
};

export const DayComponent = (props: { content: string }) => {
  return (
    <div
      id="day-component"
      className={
        props.content === "Su"
          ? "color-red"
          : props.content === "Sa"
          ? "color-blue"
          : ""
      }
    >
      <p className="align-center">{props.content}</p>
    </div>
  );
};
