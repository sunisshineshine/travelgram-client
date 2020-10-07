import React, { useEffect, useState } from "react";
import "./CalendarComponents.scss";
import { DateComponent, DayComponent } from "./DateComponents";

export const CalendarComponent = (props: {
  // base date is optional
  date?: Date;
  // highlightRange is optinal
  highlightRange?: TimeBased;
  // callback for user selecting date
  onDateSelected: DateCallBack;
}) => {
  const today = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // year and month for current calendar
  const [year, setYear] = useState(
    props.date?.getFullYear() || today.getFullYear()
  );
  const [month, setMonth] = useState(
    props.date?.getMonth() || today.getMonth()
  );
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
    console.log("update ui");
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
    <div id="calendar-component" className="border-radius border-primary">
      <div id="top-bar" className="flex-row justify-content-space-between">
        <div onClick={decreaseMonth}>⏪</div>
        <label className="text-label font-size-md">
          {monthNames[month]}, {year}
        </label>
        <div onClick={increaseMonth}>⏩</div>
      </div>
      <div id="calendar">
        <div className="flex-row border-bottom-primary">
          {days.map((day, index) => (
            <DayComponent key={index} content={day} />
          ))}
        </div>
        <div className="flex-column" style={{ marginTop: "8px" }}>
          {weeks.map((week) => {
            return (
              <div
                key={Math.random()}
                id="week"
                className="flex-row"
                style={{ marginBottom: "5px" }}
              >
                {week.map((date) => {
                  const isStart = isSameDate({
                    standard: props.highlightRange?.startTime || undefined,
                    target: date.getTime(),
                  });
                  const isEnd = isSameDate({
                    standard: props.highlightRange?.endTime || undefined,
                    target: date.getTime(),
                  });
                  return (
                    <DateComponent
                      key={Math.random()}
                      date={date}
                      isStart={isStart}
                      isEnd={isEnd}
                      isSelected={
                        props.highlightRange &&
                        props.highlightRange.startTime &&
                        props.highlightRange.endTime &&
                        date.getTime() >= props.highlightRange.startTime &&
                        date.getTime() <= props.highlightRange.endTime
                          ? true
                          : isStart || isEnd
                          ? true
                          : false
                      }
                      isToday={date === today}
                      isDisabled={date.getMonth() != month}
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
