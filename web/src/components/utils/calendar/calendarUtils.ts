export const monthNames = [
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

export const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const getPeriodString = (props: {
  period: TimeBased;
  type: "DATE" | "CLOCK";
  displayYear?: boolean;
  displayClock?: boolean;
}): string => {
  const { startTime, endTime } = props.period;
  const { type, displayYear, displayClock } = props;

  const startDateString = getDateString({ time: startTime, displayYear });
  const startClockString = getClockString({ time: startTime });

  const endDateString = getDateString({ time: endTime, displayYear });
  const endClockString = getClockString({ time: endTime });

  // date is same
  if (startDateString === endDateString) {
    switch (type) {
      case "DATE":
        return getDateString({ time: startTime });
      case "CLOCK":
        if (startClockString === endClockString) {
          // clock also same
          return startClockString;
        } else {
          // date is same but clock is different
          const startDate = startTime && new Date(startTime);
          const endDate = startTime && new Date(startTime);
          // check all day period
          if (
            startDate &&
            endDate &&
            endTime &&
            startDate.getHours() == 0 &&
            startDate.getMinutes() == 0 &&
            new Date(endTime + 1).getDate() != endDate.getDate()
          ) {
            return "All day";
          } else {
            // not all day
            return `${startTime ? startClockString : ""}~${
              endTime ? endClockString : ""
            }`;
          }
        }
    }
  } else {
    // date is different
    if (displayClock) {
      // date is same but clock is different
      const startDate = startTime && new Date(startTime);
      const endDate = startTime && new Date(startTime);
      // check all day period
      if (
        startDate &&
        endDate &&
        endTime &&
        startDate.getHours() == 0 &&
        startDate.getMinutes() == 0 &&
        new Date(endTime + 1).getDate() != endDate.getDate()
      ) {
        return "All day";
      } else {
        // not all day
        return `${startTime ? startDateString : ""} ${
          startTime ? startClockString : ""
        }\n ~ ${endTime ? endDateString : ""} ${endTime ? endClockString : ""}`;
      }
    }
    return `${startTime ? startDateString : ""}~${
      endTime ? endDateString : ""
    }`;
  }
};

export const getDateString = (props: {
  time: number | null;
  displayYear?: boolean;
}): string => {
  const { time } = props;

  if (!time) {
    return "not selected";
  }

  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dateOfMonth = date.getDate();

  if (props.displayYear) {
    return `${year}/${month}/${dateOfMonth}`;
  } else {
    return `${month}/${dateOfMonth}`;
  }
};

export const getClockString = (props: {
  time: number | null;
  displayDate?: boolean;
}): string => {
  const { time, displayDate } = props;

  if (!time) {
    return "not selected";
  }

  const date = new Date(time);
  if (displayDate) {
    return `${getDateString({ time })} ${displayClockNumber(
      date.getHours()
    )}:${displayClockNumber(date.getMinutes())}`;
  } else {
    return `${displayClockNumber(date.getHours())}:${displayClockNumber(
      date.getMinutes()
    )}`;
  }
};

export const displayClockNumber = (number: number): string => {
  if (number <= 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
};

export const getAllDayPeriod = (props: { time: number }): TimeBased => {
  const date = new Date(props.time);
  return {
    startTime: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime(),
    endTime:
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      ).getTime() - 1,
  };
};
