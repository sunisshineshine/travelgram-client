import React, { useEffect, useState } from "react";
import "./ClockComponent.scss";

export const displayClockNumber = (number: number): string => {
  if (number <= 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
};
export const ClockComponent = (props: {
  clock?: Clock;
  onSubmit: ClockCallBack;
}) => {
  const [hours, setHours] = useState<number>(props.clock?.hours || 0);
  const [minutes, setMinutes] = useState<number>(props.clock?.minutes || 0);
  useEffect(() => {
    if (props.clock) {
      setHours(props.clock.hours);
      setMinutes(props.clock.minutes);
    }
  }, [props.clock]);

  const clearState = () => {
    setHours(0);
    setMinutes(0);
  };

  const handleHoursChanged = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);

    let currentHours = hours;
    if (e.key === "Backspace") {
      setHours((hours) => (hours >= 10 ? Math.floor(hours / 10) : 0));
    }
    const input = parseInt(e.key);
    if (!(0 <= input && input < 10)) {
      return;
    }
    if (currentHours === 0) {
      currentHours += input;
    } else {
      currentHours = currentHours * 10 + input;
    }
    if (currentHours > 24) {
      // setMessage("cannot change hours to over 24");
      return;
    } else {
      if (currentHours === 24) {
        setMinutes(0);
      }
      setHours(currentHours);
    }
  };

  const handleMinutesChanged = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    let currentMinutes = minutes;
    if (e.key === "Backspace") {
      setMinutes((minutes) => (minutes >= 10 ? Math.floor(minutes / 10) : 0));
    }

    if (hours >= 24) {
      setMinutes(0);
      return;
    }
    const input = parseInt(e.key);
    if (!(0 <= input && input < 10)) {
      return;
    }
    if (currentMinutes === 0) {
      currentMinutes += input;
    } else {
      currentMinutes = currentMinutes * 10 + input;
    }
    if (currentMinutes >= 60) {
      // setMessage("cannot change hours to over 24");
      return;
    } else {
      setMinutes(currentMinutes);
    }
  };

  return (
    <div id="clock-component">
      <div className="border-primary border-radius">
        {/* <p>save</p> */}
        <div id="clock-select" className="flex-row justify-content-center">
          <input
            id="hours-input"
            value={displayClockNumber(hours)}
            placeholder="00"
            onKeyDown={handleHoursChanged}
            onFocus={() => setHours(0)}
          />
          <p id="divider">:</p>
          <input
            id="minutes-input"
            value={displayClockNumber(minutes)}
            onKeyDown={handleMinutesChanged}
            onFocus={() => setMinutes(0)}
          />
        </div>
        <p
          id="save-button"
          onClick={() => {
            props.onSubmit({ hours, minutes });
            clearState();
          }}
        >
          SAVE
        </p>
      </div>
    </div>
  );
};
