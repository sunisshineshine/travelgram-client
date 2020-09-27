import React, { useState } from "react";
import "./CalendarComponent.css";

type MonthArray = WeekArray[];

type WeekArray = number[];

export const CalendarComponent = (props: {
  title: string;
  date?: Date;
  onDateSelected: (date: Date) => void;
}) => {
  const today = new Date();

  const [selectedDate] = useState(props.date ? props.date : today);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();
  const dateTemp = new Date(selectedYear, selectedMonth, 1);
  console.log(dateTemp.getDay());

  const createDateArray = (): MonthArray => {
    let i = 1 - dateTemp.getDay();
    const monthArray: MonthArray = [];
    let weekArray: WeekArray = [];
    while (i < 31 || monthArray.length <= 5) {
      if (weekArray.length == 7) {
        monthArray.push(weekArray);
        weekArray = [];
      }
      weekArray.push(i);
      i += 1;
    }
    return monthArray;
  };

  console.log(createDateArray());

  return (
    <div className="calendar-component">
      <h2 className="title">{props.title}</h2>
      <div className="row-container">
        {days.map((day, index) => (
          <DayComponent key={index} content={day} />
        ))}
      </div>
      <div>
        {createDateArray().map((weekArray) => {
          return (
            <div key={Math.random()} className="row-container">
              {weekArray.map((date) => (
                <DateComponent
                  key={Math.random()}
                  date={new Date(selectedYear, selectedMonth, date)}
                  onClcicked={props.onDateSelected}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayComponent = (props: { content: string }) => {
  return (
    <div className="date-component">
      <p className="content">{props.content}</p>
    </div>
  );
};
const DateComponent = (props: {
  date: Date;
  onClcicked: (date: Date) => void;
}) => {
  return (
    <div
      className="date-component"
      onClick={() => {
        props.onClcicked(props.date);
      }}
    >
      <p className="content">{props.date.getDate()}</p>
    </div>
  );
};
