import React, { useState } from "react";
import { CalendarComponent } from "./CalendarComponents";
import { DateStringComponent } from "./DateComponents";
import "./PeriodComponents.scss";

export const SelectPeriodComponent = (props: {
  title: string;
  date?: Date;
  selectedRange?: TimeBased;
  onRangeUpdated: TimebasedCallBack;
}) => {
  const [selectedPeriod, setPeriod] = useState<TimeBased | undefined>(
    props.selectedRange
  );
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
  };

  return (
    <div id="select-period-component">
      <label className="text-label">{props.title}</label>
      <PeriodComponent period={selectedPeriod} />
      <div id="calendar-display">
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

export const PeriodStringComponent = (props: { period: TimeBased }) => {
  const { period: time } = props;

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
