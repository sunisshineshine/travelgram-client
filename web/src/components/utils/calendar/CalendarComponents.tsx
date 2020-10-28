import React, { useEffect, useState } from "react";
import { NextButton, PrevButton } from "../../ButtonComponents";
import "./CalendarComponents.scss";
import { days, monthNames } from "./calendarUtils";
import { DateComponent, DayComponent } from "./DateComponents";

export const CalendarComponent = (props: {
  // base date is optional
  date?: Date;
  // highlightRange is optinal
  selectedRange?: TimeBased;
  // callback for user selecting date
  baseRange?: TimeBased;
  onDateSelected: DateCallBack;
}) => {
  const today = new Date();

  // year and month for current calendar
  const [year, setYear] = useState(
    props.date?.getFullYear() || today.getFullYear()
  );
  const [month, setMonth] = useState(
    props.date?.getMonth() || today.getMonth()
  );

  useEffect(() => {
    if (props.date) {
      setMonth(props.date.getMonth());
    }
  }, [props.date]);

  // update when user change month
  useEffect(() => {
    updateCalendar();
  }, [month]);

  const increaseMonth = () => {
    if (month == 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const decreaseMonth = () => {
    if (month == 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  // weeks that having dates data
  const [weeks, setWeeks] = useState<Week[]>([]);

  const updateCalendar = () => {
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, -1);
    let i = 1 - firstDate.getDay();

    const weeksArray: Week[] = [];
    let currentWeek: Date[] = [];
    while (i <= lastDate.getDate()) {
      const date = new Date(year, month, i);
      currentWeek.push(date);
      if (date.getDay() == 6) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
      i += 1;
    }
    while (currentWeek.length < 7) {
      const date = new Date(year, month, i);
      currentWeek.push(date);
      i += 1;
    }
    weeksArray.push(currentWeek);
    setWeeks(weeksArray);
  };

  const isSameDate = (props: {
    standard?: number;
    target: number;
  }): boolean => {
    const standard = new Date(props.standard || 0);
    const target = new Date(props.target);
    return (
      standard.getFullYear() === target.getFullYear() &&
      standard.getMonth() === target.getMonth() &&
      standard.getDate() === target.getDate()
    );
  };

  return (
    <div id="calendar-component">
      <div id="top-bar" className="flex-row justify-content-space-between">
        <PrevButton onClick={decreaseMonth} />
        <h3>
          {monthNames[month]}, {year}
        </h3>
        <NextButton onClick={increaseMonth} />
      </div>
      <div id="calendar">
        <div id="days-container">
          {days.map((day, index) => (
            <DayComponent key={index} content={day} />
          ))}
        </div>
        <div id="dates-container">
          {weeks.map((week) => {
            return (
              <div className="week-container" key={Math.random()}>
                {week.map((date) => {
                  const { baseRange, selectedRange } = props;
                  const isStart = isSameDate({
                    standard: props.selectedRange?.startTime || undefined,
                    target: date.getTime(),
                  });
                  const isEnd = isSameDate({
                    standard: props.selectedRange?.endTime || undefined,
                    target: date.getTime(),
                  });
                  const isSelcted =
                    selectedRange &&
                    selectedRange.startTime &&
                    selectedRange.endTime &&
                    date.getTime() >= selectedRange.startTime &&
                    date.getTime() <= selectedRange.endTime
                      ? true
                      : isStart || isEnd
                      ? true
                      : false;

                  const isDisabled =
                    date.getMonth() != month ||
                    (baseRange &&
                      !(baseRange &&
                      baseRange.startTime &&
                      baseRange.endTime &&
                      date.getTime() >= baseRange.startTime &&
                      date.getTime() <= baseRange.endTime
                        ? true
                        : isStart || isEnd
                        ? true
                        : false));

                  return (
                    <DateComponent
                      key={Math.random()}
                      date={date}
                      isStart={isStart}
                      isEnd={isEnd}
                      isSelected={isSelcted}
                      isToday={date.toDateString() === today.toDateString()}
                      isDisabled={isDisabled}
                      onClcicked={props.onDateSelected}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
