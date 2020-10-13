import React, { useState } from "react";
import { getAllDayPeriod, getPeriodString } from "../calendarUtils";
import { SelectDatePeriodComponent } from "./SelectDateComponent";
import "./SelectFromPeriodComponent.scss";

export const SelectFromPeriodComponent = (props: {
  basePeriod: TimeBased;
  selectedPeriod?: TimeBased;
  onPeriodUpdate: TimebasedCallBack;
}) => {
  const { basePeriod, selectedPeriod } = props;
  const [isDisplayClanedar, setDisplayCalendar] = useState(false);

  const onNextButtonClicked = () => {
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
    props.onPeriodUpdate(getAllDayPeriod({ time: nextDate.getTime() }));
  };

  const onPrevButtonClicked = () => {
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
    props.onPeriodUpdate(getAllDayPeriod({ time: nextDate.getTime() }));
  };

  return (
    <div id="select-from-period-component">
      {selectedPeriod ? (
        <div className="flex-row">
          <p onClick={onPrevButtonClicked}>◀</p>
          <p
            onClick={() => {
              setDisplayCalendar((prev) => !prev);
            }}
          >
            {getPeriodString({ period: selectedPeriod, type: "DATE" })}
          </p>
          <p onClick={onNextButtonClicked}>▶</p>
          <p>All day</p>
        </div>
      ) : (
        <p
          onClick={() => {
            setDisplayCalendar((prev) => !prev);
          }}
        >
          not selected
        </p>
      )}
      <div style={{ display: isDisplayClanedar ? "block" : "none" }}>
        <SelectDatePeriodComponent
          baseRange={basePeriod}
          selectedRange={selectedPeriod}
          onRangeUpdated={props.onPeriodUpdate}
        />
      </div>
    </div>
  );
};
