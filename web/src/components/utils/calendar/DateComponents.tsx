import React from "react";
import { CalendarIcon } from "../../Icons";
import { displayClockNumber } from "./calendarUtils";

import "./DateComponents.scss";

export function DateComponent(props: {
  date: Date;
  isSelected: boolean;
  isSemiSelected?: boolean;
  isToday?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  isDisabled?: boolean;
  onClcicked: DateCallBack;
}) {
  const {
    date,
    isSelected,
    isDisabled,
    isEnd,
    isSemiSelected,
    isStart,
    isToday,
  } = props;

  let className = "";
  if (isSelected) {
    className += " selected";
  }
  if (isToday) {
    className += " today";
  }
  if (isStart) {
    className += " start";
  }
  if (isEnd) {
    className += " end";
  }
  if (isDisabled) {
    className += " disabled";
  }
  if (isSemiSelected && !isSelected) {
    className += " semi-selected";
  }

  const displayCaption = (): string => {
    if (isToday) {
      return "today";
    }

    return "";
  };

  return (
    <div
      id="date-component"
      onClick={() => {
        if (!isDisabled) {
          props.onClcicked(date);
        }
      }}
    >
      <div className={className}>
        <p className="align-center">{date.getDate()}</p>
        <label>{displayCaption()}</label>
      </div>
    </div>
  );
}

export function DateStringComponent(props: {
  date?: Date | number;
  isDisplayClock: boolean;
}) {
  const date =
    typeof props.date === "number" ? new Date(props.date) : props.date;
  const { isDisplayClock } = props;

  return (
    <div id="date-string-component">
      <CalendarIcon />
      <div id="date-string" className="font-size-lg">
        {date ? (
          <h3>
            {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
            {isDisplayClock && (date.getHours() || date.getMinutes())
              ? " " +
                displayClockNumber(date.getHours()) +
                ":" +
                displayClockNumber(date.getMinutes())
              : ""}
          </h3>
        ) : (
          <h3>not selected</h3>
        )}
      </div>
    </div>
  );
}

export function DayComponent(props: { content: string }) {
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
}
