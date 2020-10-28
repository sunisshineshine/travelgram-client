import React, { useState, useEffect } from "react";
import { CalendarComponent } from "../CalendarComponents";
import { getAllDayPeriod } from "../calendarUtils";
// import "./SelectDatePeriodComponent.scss";

// type TimeSelectMethod = "NONE" | "START_DATE" | "END_DATE";

export const SelectDatePeriodComponent = (props: {
  title?: string;
  isDisplayPeriod?: boolean;
  date?: Date;
  selectedRange?: TimeBased;
  baseRange?: TimeBased;
  size?: Size;
  onRangeUpdated: TimebasedCallBack;
}) => {
  const [selectedPeriod, setPeriod] = useState<TimeBased | undefined>(
    props.selectedRange
  );
  // when parents update => props update
  useEffect(() => {
    setPeriod(props.selectedRange);
  }, [props.selectedRange]);

  // child update => parents update
  useEffect(() => {
    if (selectedPeriod) {
      props.onRangeUpdated(selectedPeriod);
    }
  }, [selectedPeriod]);

  const onDateSelected: DateCallBack = (date: Date) => {
    const { baseRange } = props;
    if (baseRange) {
      if (baseRange.startTime && baseRange.startTime > date.getTime()) {
        return;
      }
      if (baseRange.endTime && baseRange.endTime < date.getTime()) {
        return;
      }
    }

    let period: TimeBased = { startTime: null, endTime: null };
    if (!selectedPeriod) {
      // period not initialized
      period = {
        startTime: date.getTime(),
        endTime: null,
      };
    } else {
      if (!selectedPeriod.startTime) {
        // period exist but not has startTime
        period = { startTime: date.getTime(), endTime: null };
      } else {
        // start time exist
        if (!selectedPeriod.endTime) {
          // start time exist but end time is not exist
          if (date.getTime() >= selectedPeriod.startTime) {
            // selected date is later than starttime
            period = {
              startTime: selectedPeriod.startTime,
              endTime: getAllDayPeriod({ time: date.getTime() }).endTime,
            };
          } else {
            // selected date is earlier than starttime
            period = {
              startTime: null,
              endTime: null,
            };
          }
        } else {
          // start and end time both exist
          period = {
            startTime: null,
            endTime: null,
          };
        }
      }
    }
    console.log("selected period changed :", period);
    setPeriod(period);
    forceRender();
  };

  const setEmptyState = useState(0)[1];
  const forceRender = () => {
    const period = selectedPeriod;
    if (!period) {
      return;
    }
    let temp = 0;
    if (period.endTime) {
      temp += period.endTime;
    }

    if (period.startTime) {
      temp += period.startTime;
    }
    setEmptyState(temp);
  };

  return (
    <div id="select-period-component">
      <div>
        <label>{props.title}</label>
        <div id="select-period">
          <div id="calendar-display">
            <CalendarComponent
              date={props.date}
              selectedRange={selectedPeriod}
              baseRange={props.baseRange}
              onDateSelected={onDateSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
