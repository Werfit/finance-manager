import { Category, Record, Sheet } from "@/libs/db/schema";
import { differenceInMonths, nextMonth } from "@/shared/utils/date.util";
import {
  generateRandomDate,
  generateRandomNumber,
} from "@/shared/utils/random.util";

type NumberRange = {
  min: number;
  max: number;
};

type DateRange = {
  from: Date;
  to: Date;
};

type GenerateRandomTransactionsProps = {
  amount: NumberRange;
  frequency: NumberRange;
  totalTransactions: number; // Added total transactions constraint
  period: DateRange;
  categoryId: Category["id"];
  sheetId: Sheet["id"];
};

export const generateCategoryRandomTransactions = ({
  amount: amountRange,
  frequency: frequencyRange,
  totalTransactions,
  categoryId,
  period,
  sheetId,
}: GenerateRandomTransactionsProps) => {
  const months = Math.max(differenceInMonths(period.from, period.to), 1);

  let remainingTransactions = totalTransactions;
  const records: Omit<Record, "id">[] = [];
  let indexDate = period.from;

  for (let month = 0; month < months; month++) {
    const upcomingMonth = nextMonth(indexDate);

    const maxFrequency = Math.min(frequencyRange.max, remainingTransactions);
    const minFrequency = Math.min(frequencyRange.min, remainingTransactions);
    const frequency = generateRandomNumber(minFrequency, maxFrequency);

    for (let i = 0; i < frequency; i++) {
      records.push({
        amount: generateRandomNumber(amountRange.min, amountRange.max),
        categoryId,
        sheetId,
        createdAt: generateRandomDate(indexDate, upcomingMonth),
      });
    }

    remainingTransactions -= frequency;
    if (remainingTransactions <= 0) break;

    indexDate = upcomingMonth;
  }

  return records;
};
