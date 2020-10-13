import React, { useState, useEffect } from "react";
import { CalendarComponent } from "../CalendarComponents";
import { PeriodStringComponent, PeriodComponent } from "./PeriodComponents";
import "./SelectDateComponent.scss";

// type TimeSelectMethod = "NONE" | "START_DATE" | "END_DATE";

export const SelectDatePeriodComponent = (props: {
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

  // const [currentSelectingMethod, setMethod] = useState<TimeSelectMethod>(
  //   "NONE"
  // );
  // const [message, setMessage] = useState("");
  // const [calendarDisplay, setCalendarDisplay] = useState(false);
  // const [clockDisplay, setClockDisplay] = useState(true);

  // useEffect(() => {
  //   switch (currentSelectingMethod) {
  //     case "NONE":
  //       setCalendarDisplay(false);
  //       setClockDisplay(false);
  //       setMessage("");
  //       break;
  //     case "START_DATE":
  //       setCalendarDisplay(true);
  //       setClockDisplay(false);
  //       setMessage("SET YOUR START DATE");
  //       break;
  //     case "END_DATE":
  //       setCalendarDisplay(true);
  //       setClockDisplay(false);
  //       setMessage("SET YOUR END DATE");
  //       break;
  //   }
  //   forceRender();
  // }, [currentSelectingMethod]);

  const onDateSelected: DateCallBack = (date: Date) => {
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
              endTime: date.getTime(),
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
    // switch (currentSelectingMethod) {
    //   case "START_DATE":
    //     setPeriod({
    //       startTime: date.getTime(),
    //       endTime: null,
    //     });
    //     setMethod("END_DATE");
    //     break;
    //   case "END_DATE":
    //     setPeriod({
    //       startTime: selectedPeriod?.startTime || null,
    //       endTime: date.getTime(),
    //     });
    //     setMethod("START_DATE");
    //     break;
    // }
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
          <PeriodComponent
            period={selectedPeriod}
            // onStartClicked={() => {
            //   currentSelectingMethod == "START_DATE"
            //     ? setMethod("NONE")
            //     : setMethod("START_DATE");
            // }}
            // onEndClicked={() =>
            //   currentSelectingMethod == "END_DATE"
            //     ? setMethod("NONE")
            //     : setMethod("END_DATE")
            // }
          />
        </div>
        <div id="select-period">
          <div id="calendar-display">
            <CalendarComponent
              date={props.date}
              highlightRange={selectedPeriod}
              onDateSelected={onDateSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// const onClockSelected: ClockCallBack = (clock: Clock) => {
//   const period = selectedPeriod;
//   if (!period) {
//     return;
//   }
//   const setClock = (time: number, clock: Clock): number => {
//     let result =
//       time + clock.hours * 60 * 60 * 1000 + clock.minutes * 60 * 1000;
//     if (clock.hours === 24) {
//       result -= 1;
//     }
//     return result;
//   };
//   switch (currentSelectingMethod) {
//     case "START_CLOCK":
//       if (!period?.startTime) {
//         return;
//       }
//       period.startTime = setClock(period?.startTime, clock);
//       setMethod("END_DATE");
//       break;
//     case "END_CLOCK":
//       if (!period?.endTime) {
//         return;
//       }
//       period.endTime = setClock(period?.endTime, clock);
//       setMethod("START_DATE");
//       break;
//   }
//   setPeriod(period);
// };
