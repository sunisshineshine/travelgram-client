import React, { useState, useEffect } from "react";
import { NextButton, PrevButton } from "../../../ButtonComponents";
import { CalendarComponent } from "../CalendarComponents";
import {
  getAllDayPeriod,
  getClockString,
  getDateString,
} from "../calendarUtils";

import "./SelectPeriodComponents.scss";

interface SelectPeriodProps {
  selectedPeriod?: Period;
  basePeriod?: Period;
  onPeriodUpdated: PeriodCallBack;
}

interface SelectDatePeriodProps extends SelectPeriodProps {
  title: string;
}
export function SelectDatePeriodComponent(props: SelectDatePeriodProps) {
  const { title, basePeriod } = props;

  const [selectedPeriod, setPeriod] = useState<Period | undefined>(
    props.selectedPeriod
  );

  useEffect(() => {
    if (selectedPeriod) {
      props.onPeriodUpdated(selectedPeriod);
    }
  }, [selectedPeriod]);

  // when parents update => props update
  useEffect(() => {
    setPeriod(props.selectedPeriod);
  }, [props.selectedPeriod]);

  const onDateSelected: DateCallBack = (date: Date) => {
    if (basePeriod) {
      if (basePeriod.startTime && basePeriod.startTime > date.getTime()) {
        return;
      }
      if (basePeriod.endTime && basePeriod.endTime < date.getTime()) {
        return;
      }
    }

    let period: Period = { startTime: null, endTime: null };
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
    console.info("selected period changed :", period);
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
    <div id="select-date-period-component">
      <div>
        <label>{title}</label>
        <div id="select-period">
          <div id="calendar-display">
            <CalendarComponent
              selectedPeriod={selectedPeriod}
              basePeriod={basePeriod}
              onDateSelected={onDateSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelectClockPeriodComponent(props: { period: Period }) {
  console.error(props);
  return (
    <div id="select-clock-period-component" className="flex-coloumn">
      <label>Strart at</label>
      <input />
      <label>End at</label>
      <input />
    </div>
  );
}

export const SelectPeriodStringComponent = (props: SelectPeriodProps) => {
  const { basePeriod, selectedPeriod } = props;

  const [selectingMethod, setSelectingMethod] = useState<
    "NONE" | "START_DATE" | "END_DATE"
  >("NONE");
  const [isDisplayCalendar, setDisplayCalendar] = useState(false);

  const handleNextButtonClicked = () => {
    if (!selectedPeriod) {
      return;
    }

    const { startTime } = selectedPeriod;
    if (!startTime) {
      return;
    }
    const startDate = new Date(startTime);
    const nextDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1
    );

    props.onPeriodUpdated(getAllDayPeriod({ time: nextDate.getTime() }));
  };

  const handlePrevButtonClicked = () => {
    if (!selectedPeriod) {
      return;
    }

    const { startTime } = selectedPeriod;
    if (!startTime) {
      return;
    }
    const startDate = new Date(startTime);
    const nextDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() - 1
    );
    props.onPeriodUpdated(getAllDayPeriod({ time: nextDate.getTime() }));
  };

  const baseDate = selectedPeriod?.startTime
    ? new Date(selectedPeriod?.startTime)
    : null;
  return (
    <div
      id="select-period-string-component"
      // className={isDisplayClanedar ? "focused" : ""}
    >
      <div id="period-container">
        <PrevButton onClick={handlePrevButtonClicked} />
        <p
          onClick={() => {
            if (isDisplayCalendar) {
              setDisplayCalendar(false);
              setSelectingMethod("NONE");
            } else {
              setDisplayCalendar(true);
              setSelectingMethod("START_DATE");
            }
          }}
        >
          {getDateString({ time: selectedPeriod?.startTime || null })}
        </p>
        <p>{getClockString({ time: selectedPeriod?.startTime || null })}</p>

        <p>~</p>
        <p
          onClick={() => {
            if (isDisplayCalendar) {
              setDisplayCalendar(false);
              setSelectingMethod("NONE");
            } else {
              setDisplayCalendar(true);
              setSelectingMethod("END_DATE");
            }
          }}
        >
          {getDateString({ time: selectedPeriod?.endTime || null })}
        </p>
        <p>{getClockString({ time: selectedPeriod?.endTime || null })}</p>
        <NextButton onClick={handleNextButtonClicked} />
      </div>
      <div style={{ display: isDisplayCalendar ? "block" : "none" }}>
        <CalendarComponent
          year={baseDate?.getFullYear()}
          month={baseDate?.getMonth()}
          basePeriod={basePeriod}
          onDateSelected={(date) => {
            console.log(selectingMethod);
            switch (selectingMethod) {
              case "START_DATE":
                props.onPeriodUpdated({
                  startTime: date.getTime(),
                  endTime: selectedPeriod?.endTime || null,
                });
                setDisplayCalendar(false);
                setSelectingMethod("NONE");
                return;
              case "END_DATE":
                props.onPeriodUpdated({
                  startTime: selectedPeriod?.startTime || null,
                  endTime: date.getTime(),
                });
                setDisplayCalendar(false);
                setSelectingMethod("NONE");
                return;
            }
          }}
        />
      </div>
    </div>
  );
};
