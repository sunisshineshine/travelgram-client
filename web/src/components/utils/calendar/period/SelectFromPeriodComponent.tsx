import React, { useContext, useEffect, useState } from "react";
import { LoadingStateContext } from "../../Loading/LoadingModal";
import { getAllDayPeriod, getPeriodString } from "../calendarUtils";
import { SelectDatePeriodComponent } from "./SelectDatePeriodComponent";
import "./SelectFromPeriodComponent.scss";

export const SelectFromPeriodComponent = (props: {
  basePeriod: TimeBased;
  selectedPeriod?: TimeBased;
  onPeriodUpdate: TimebasedCallBack;
}) => {
  const { basePeriod, selectedPeriod } = props;
  const [isDisplayClanedar, setDisplayCalendar] = useState(false);
  const setLoading = useContext(LoadingStateContext)![1];
  useEffect(() => {
    if (isDisplayClanedar) {
      setLoading({ activated: "blur" });
    } else {
      setLoading({ activated: false });
    }
  }, [isDisplayClanedar]);

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
    <div
      id="select-from-period-component"
      className={isDisplayClanedar ? "focused" : ""}
    >
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
