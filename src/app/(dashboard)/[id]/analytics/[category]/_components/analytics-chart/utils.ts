import { ValueType } from "recharts/types/component/DefaultTooltipContent";

import { Record as RecordType } from "@/libs/db/schema";
import { formatCurrency } from "@/shared/utils/number.util";

export type TransactionDate = `${string}-${string}`;

export const extractMonth = (date: Date): TransactionDate => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const month_ = month < 10 ? `0${month}` : month;

  return `${year}-${month_}`;
};

export const preprocessChartData = (records: RecordType[]) => {
  const statistics: Record<
    TransactionDate,
    {
      date: TransactionDate;
      amount: number;
      transactions: number;
    }
  > = {};

  for (const record of records) {
    const date = extractMonth(record.createdAt);

    if (!statistics[date]) {
      statistics[date] = {
        date,
        amount: 0,
        transactions: 0,
      };
    }

    statistics[date].amount += record.amount;
    statistics[date].transactions++;
  }

  return Object.values(statistics);
};

export const formatTransactionDate = (date: TransactionDate) => {
  const [year, month] = date.split("-");
  const date_ = new Date(parseInt(year), parseInt(month) - 1);

  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date_);
};

export const processValuePayload = (value: ValueType) => {
  if (typeof value === "object" && Array.isArray(value)) {
    return value
      .map((value) => formatCurrency(parseFloat(value.toString())))
      .join(",");
  }

  return formatCurrency(parseFloat(value.toString()));
};
