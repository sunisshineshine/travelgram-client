import React from "react";
import { monthNames } from "./calendarUtils";
import "./DateDeviderComponent.scss";

export const DateDividerComponent = (props: { base?: Date; date: Date }) => {
  const { base, date } = props;

  const differFromBase = (): string | undefined => {
    if (!base) {
      return undefined;
    }
    const differ =
      Math.floor((date.getTime() - base.getTime()) / (1000 * 3600 * 24)) + 1;

    switch (differ % 10) {
      case 1:
        return differ + "st day";
      case 2:
        return differ + "nd day";
      default:
        return differ + "rd day";
    }
  };
  return (
    <div id="date-divider-component">
      <p id="divider" />
      <div id="date-string">
        {date.getTime() === 0 ? (
          "date not selected"
        ) : (
          <>
            <p id="counter">{differFromBase()}</p>
            <p>
              {`${
                monthNames[date.getMonth()]
              } ${date.getDate()}, ${date.getFullYear()}`}
            </p>
          </>
        )}
      </div>
      <p id="divider" />
    </div>
  );
};
