import React, { useEffect, useState } from "react";
import "./CalendarComponent.scss";

// type MonthArray = WeekArray[];

export const CalendarSelectRangeComponent = (props: {
  title: string;
  date?: Date;
  selectedRange?: TimeBased;
  onRangeUpdated: TimebasedCallBack;
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeBased | undefined>(
    props.selectedRange
  );
  const onDateSelected: DateCallBack = (date: Date) => {
    console.log(date);
    let range = selectedRange;
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
    setSelectedRange(range);
  };

  return (
    <div id="calendar-select-range-component">
      <label className="text-label">{props.title}</label>
      <div id="date-display" className="border-primary border-radius flex-row">
        <div id="date-display-start" className="border-right-primary">
          <DateDisplayComponent date={selectedRange?.startTime || undefined} />
        </div>
        <div id="date-display-end">
          <DateDisplayComponent date={selectedRange?.endTime || undefined} />
        </div>
      </div>
      <div id="calendar-display">
        <CalendarComponent
          highlightRange={selectedRange}
          onDateSelected={onDateSelected}
        />
      </div>
    </div>
  );
};

export const DateDisplayComponent = (props: { date?: Date | number }) => {
  const date =
    typeof props.date === "number" ? new Date(props.date) : props.date;

  return (
    <div id="date-display-component" className="flex-row align-items-center">
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

const CalendarComponent = (props: {
  // base date is optional
  date?: Date;
  highlightRange?: TimeBased;
  onDateSelected: DateCallBack;
}) => {
  const today = new Date();
  const [year, setYear] = useState(
    props.date?.getFullYear() || today.getFullYear()
  );
  const [month, setMonth] = useState(
    props.date?.getMonth() || today.getMonth()
  );

  const renderingWeekList = () => {
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

  useEffect(() => {
    renderingWeekList();
  }, [month]);
  const [weeks, setWeeks] = useState<Week[]>([]);
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

  return (
    <div id="calendar-component" className="border-radius border-primary">
      <div id="top-bar" className="flex-row justify-content-space-between">
        <div onClick={decreaseMonth}>prev</div>
        <label className="text-label font-size-md">
          {monthNames[month]}, {year}
        </label>
        <div onClick={increaseMonth}>next</div>
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
                  const isStart =
                    props.highlightRange?.startTime === date.getTime();
                  const isEnd =
                    props.highlightRange?.endTime === date.getTime();
                  return (
                    <DateComponent
                      key={Math.random()}
                      date={date}
                      isSelected={
                        props.highlightRange &&
                        props.highlightRange.startTime &&
                        props.highlightRange.endTime &&
                        date.getTime() >= props.highlightRange.startTime &&
                        date.getTime() <= props.highlightRange.endTime
                          ? true
                          : false
                      }
                      isStart={isStart}
                      isEnd={isEnd}
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
const DayComponent = (props: { content: string }) => {
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

const DateComponent = (props: {
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
