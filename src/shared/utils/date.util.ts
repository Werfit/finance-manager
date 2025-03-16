export const formatDate = (date: Date) => {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const startOfDay = (date: Date) => {
  const date_ = new Date(date);

  date_.setHours(0, 0, 0, 0);
  return date_;
};

export const endOfDay = (date: Date) => {
  const date_ = new Date(date);

  date_.setHours(23, 59, 59, 999);
  return date_;
};

export const differenceInMonths = (from: Date, to: Date): number => {
  const yearDiff = to.getFullYear() - from.getFullYear();
  const monthDiff = to.getMonth() - from.getMonth();
  return yearDiff * 12 + monthDiff;
};

export const nextMonth = (date: Date) => {
  const date_ = new Date(date);
  date_.setMonth(date_.getMonth() + 1);
  return date_;
};
