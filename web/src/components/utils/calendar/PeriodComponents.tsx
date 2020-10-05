import React, { useState } from "react";
import { CalendarComponent } from "./CalendarComponents";
import { DateStringComponent } from "./DateComponents";
import "./PeriodComponents.scss";

type Size = "lg" | "md" | "sm";

export const SelectPeriodComponent = (props: {
  title?: string;
  date?: Date;
  selectedRange?: TimeBased;
  toggleCalendar?: boolean;
  size?: Size;
  onRangeUpdated: TimebasedCallBack;
}) => {
  const [selectedPeriod, setPeriod] = useState<TimeBased | undefined>(
    props.selectedRange
  );

  const [displayCalendar, setDisplay] = useState(
    !props.toggleCalendar ? true : false
  );

  const [value, forceChange] = useState(0);
  const forceRender = (period: TimeBased) => {
    let temp = 0;
    if (period.endTime) {
      temp += period.endTime;
    }

    if (period.startTime) {
      temp += period.startTime;
    }
    forceChange(temp);
  };

  const onDateSelected: DateCallBack = (date: Date) => {
    console.log(date);
    let range = selectedPeriod;
    if (!range) {
      // if range doesn't initialized
      range = { startTime: date.getTime(), endTime: null };
    } else {
      // range is initialized
      // if start time is not initialized
      if (!range.startTime) {
        range = { startTime: date.getTime(), endTime: null };
      } else {
        // range and starttime is initialized
        if (date.getTime() < range.startTime) {
          // selectedDate is before than startedTime
          range = { startTime: null, endTime: null };
        } else {
          // selectedDate is later than started time
          if (!range.endTime) {
            // range and starttime exist but no endtime
            range.endTime = date.getTime();
          } else {
            // all object exist
            if (date.getTime() < range.endTime) {
              range = { startTime: null, endTime: null };
            } else {
              range.endTime = date.getTime();
            }
          }
        }
      }
    }
    props.onRangeUpdated(range);
    setPeriod(range);

    forceRender(range);
  };

  return (
    <div id="select-period-component">
      <div
        onClick={() => {
          if (props.toggleCalendar != undefined) {
            setDisplay((prev) => !prev);
          }
        }}
      >
        {props.size == "sm" ? (
          <PeriodStringComponent period={selectedPeriod} />
        ) : (
          <PeriodComponent period={selectedPeriod} />
        )}
      </div>
      <div
        id="calendar-display"
        style={{ display: displayCalendar ? "block" : "none" }}
      >
        <CalendarComponent
          highlightRange={selectedPeriod}
          onDateSelected={onDateSelected}
        />
      </div>
    </div>
  );
};

export const PeriodComponent = (props: { period?: TimeBased }) => {
  const { period } = props;

  return (
    <div
      id="period-component"
      className="border-primary border-radius flex-row"
    >
      <div id="period-start" className="border-right-primary">
        <DateStringComponent date={period?.startTime || undefined} />
      </div>
      <div id="period-end">
        <DateStringComponent date={period?.endTime || undefined} />
      </div>
    </div>
  );
};

export const PeriodStringComponent = (props: { period?: TimeBased }) => {
  const { period } = props;
  if (!period) {
    return (
      <div id="period-string-component" className="flex-row">
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
    : null;

  const endDateStr = endDate
    ? (endDate.getMonth() + 1).toString() + "/" + endDate.getDate().toString()
    : null;

  return (
    <div id="period-string-component" className="flex-row">
      <p className="icon">📅</p>
      <div
        id="period-string"
        className="flex-row align-items-center"
        style={{ marginLeft: "5px", height: "fit-" }}
      >
        <p>{startDateStr}</p>
        <p>{(startDate || startDateStr) && "~"} </p>
        <p>{endDateStr}</p>
      </div>
    </div>
  );
};
