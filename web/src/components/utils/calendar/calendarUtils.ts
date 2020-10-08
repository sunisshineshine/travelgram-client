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
  displayYear?: boolean;
  isClock?: boolean;
}): string => {
  const { startTime, endTime } = props.period;

  const startDate = startTime && new Date(startTime);
  const endDate = endTime && new Date(endTime);

  if (!startDate) {
    if (endDate) {
      return `not selected ~ ${getDateString({
        time: endDate.getTime(),
        displayYear: props.displayYear,
      })}`;
    } else {
      return `not selected`;
    }
  }
  if (!endDate) {
    if (startDate) {
      return `${getDateString({
        time: startDate.getTime(),
        displayYear: props.displayYear,
      })} ~ not selected`;
    } else {
      return `not selected`;
    }
  }
  const startStr = getDateString({
    time: startDate.getTime(),
    displayYear: props.displayYear,
  });

  const endStr = getDateString({
    time: endDate.getTime(),
    displayYear: props.displayYear,
  });
  //   if start and end date is same
  if (startDate.toDateString() === endDate.toDateString()) {
    if (props.isClock) {
      return "All day";
    } else {
      return `${startStr}`;
    }
  } else {
    return `${startStr} ~ ${endStr}`;
  }
};

export const getDateString = (props: {
  time: number;
  displayYear?: boolean;
}): string => {
  const date = new Date(props.time);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dateOfMonth = date.getDate();

  if (props.displayYear) {
    return `${year}/${month}/${dateOfMonth}`;
  } else {
    return `${month}/${dateOfMonth}`;
  }
};
