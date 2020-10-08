import React, { useEffect, useState } from "react";
import { CalendarComponent } from "../CalendarComponents";
import { ClockComponent } from "../ClockComponent";
import { DateStringComponent } from "../DateComponents";
import "./PeriodComponents.scss";

type Size = "lg" | "md" | "sm";

type TimeSelectMethod =
  | "NONE"
  | "START_DATE"
  | "START_CLOCK"
  | "END_DATE"
  | "END_CLOCK";

export const SelectPeriodComponent = (props: {
  title?: string;
  date?: Date;
  selectedRange?: TimeBased;
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

  const [currentSelectingMethod, setMethod] = useState<TimeSelectMethod>(
    "NONE"
  );
  const [message, setMessage] = useState("");
  const [calendarDisplay, setCalendarDisplay] = useState(false);
  const [clockDisplay, setClockDisplay] = useState(true);

  useEffect(() => {
    switch (currentSelectingMethod) {
      case "NONE":
        setCalendarDisplay(false);
        setClockDisplay(false);
        setMessage("");
        break;
      case "START_DATE":
        setCalendarDisplay(true);
        setClockDisplay(false);
        setMessage("SET YOUR START DATE");
        break;
      case "START_CLOCK":
        setCalendarDisplay(false);
        setClockDisplay(true);
        setMessage("SET YOUR START CLOCK");
        break;
      case "END_DATE":
        setCalendarDisplay(true);
        setClockDisplay(false);
        setMessage("SET YOUR END DATE");
        break;
      case "END_CLOCK":
        setCalendarDisplay(false);
        setClockDisplay(true);
        setMessage("SET YOUR ENd CLOCK");
        break;
    }
    forceRender();
  }, [currentSelectingMethod]);

  const onDateSelected: DateCallBack = (date: Date) => {
    switch (currentSelectingMethod) {
      case "START_DATE":
        setPeriod({
          startTime: date.getTime(),
          endTime: null,
        });
        setMethod("START_CLOCK");
        break;
      case "END_DATE":
        setPeriod({
          startTime: selectedPeriod?.startTime || null,
          endTime: date.getTime(),
        });
        setMethod("END_CLOCK");
        break;
    }
  };

  const onClockSelected: ClockCallBack = (clock: Clock) => {
    const period = selectedPeriod;
    if (!period) {
      return;
    }
    const setClock = (time: number, clock: Clock): number => {
      let result =
        time + clock.hours * 60 * 60 * 1000 + clock.minutes * 60 * 1000;
      if (clock.hours === 24) {
        result -= 1;
      }
      return result;
    };
    switch (currentSelectingMethod) {
      case "START_CLOCK":
        if (!period?.startTime) {
          return;
        }
        period.startTime = setClock(period?.startTime, clock);
        setMethod("END_DATE");
        break;
      case "END_CLOCK":
        if (!period?.endTime) {
          return;
        }
        period.endTime = setClock(period?.endTime, clock);
        setMethod("START_DATE");
        break;
    }
    setPeriod(period);
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
        <div>
          {props.size == "sm" ? (
            <PeriodStringComponent
              period={selectedPeriod}
              onStartClicked={() => {
                currentSelectingMethod == "START_DATE" ||
                currentSelectingMethod === "START_CLOCK"
                  ? setMethod("NONE")
                  : setMethod("START_DATE");
              }}
              onEndClicked={() =>
                currentSelectingMethod == "END_DATE" ||
                currentSelectingMethod === "END_CLOCK"
                  ? setMethod("NONE")
                  : setMethod("END_DATE")
              }
            />
          ) : (
            <PeriodComponent
              period={selectedPeriod}
              onStartClicked={() => {
                currentSelectingMethod == "START_DATE" ||
                currentSelectingMethod === "START_CLOCK"
                  ? setMethod("NONE")
                  : setMethod("START_DATE");
              }}
              onEndClicked={() =>
                currentSelectingMethod == "END_DATE" ||
                currentSelectingMethod === "END_CLOCK"
                  ? setMethod("NONE")
                  : setMethod("END_DATE")
              }
            />
          )}
        </div>
        <div
          id="select-period"
          style={{
            display: calendarDisplay || clockDisplay ? "block" : "none",
          }}
        >
          <div className="flex-row justify-content-space-between">
            <label>{message}</label>
            <div
              className="close-button-sm"
              onClick={() => {
                setMethod("NONE");
              }}
            >
              CLOSE
            </div>
          </div>
          <div
            id="calendar-display"
            style={{ display: calendarDisplay ? "block" : "none" }}
          >
            <CalendarComponent
              date={
                currentSelectingMethod === "START_DATE"
                  ? selectedPeriod?.startTime
                    ? new Date(selectedPeriod.startTime)
                    : undefined
                  : selectedPeriod?.endTime
                  ? new Date(selectedPeriod.endTime)
                  : undefined
              }
              highlightRange={selectedPeriod}
              onDateSelected={onDateSelected}
            />
          </div>
          <div
            id="clock-display"
            style={{ display: clockDisplay ? "block" : "none" }}
          >
            <ClockComponent
              clock={
                currentSelectingMethod === "END_CLOCK"
                  ? { hours: 24, minutes: 0 }
                  : undefined
              }
              onSubmit={onClockSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div id="period-string-component" className="flex-row">
      <p className="icon">📅</p>
      <div
        id="period-string"
        style={{ marginLeft: "5px", height: "fit-content" }}
      >
        {startDateStr === endDateStr ? (
          <p onClick={props.onStartClicked}>{startDateStr}</p>
        ) : (
          <div className="flex-row align-items-center">
            <p onClick={props.onStartClicked}>{startDateStr}</p>
            <p>{(startDate || startDateStr) && "~"} </p>
            <p onClick={props.onEndClicked}>{endDateStr}</p>
          </div>
        )}
      </div>
    </div>
  );
};
