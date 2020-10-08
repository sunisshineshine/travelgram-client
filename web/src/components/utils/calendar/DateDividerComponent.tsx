import React from "react";
import "./DateDeviderComponent.scss";

export const DateDividerComponent = (props: { base?: Date; date: Date }) => {
  const { base, date } = props;

  if (date.getTime() === 0) {
    return <div>date is not defined</div>;
  }
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
  //   const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
    <div id="date-divider-component" className="flex-row">
      <p id="divider" />
      <div id="date-string">
        <p id="counter">{differFromBase()}</p>
        <p>
          {`${
            monthNames[date.getMonth()]
          } ${date.getDate()}, ${date.getFullYear()}`}
        </p>
      </div>
      <p id="divider" />
    </div>
  );
};
