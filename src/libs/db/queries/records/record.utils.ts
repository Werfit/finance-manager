import { importedRecordsSchema } from "@/shared/schemas/record.schema";

export const processCSVRecords = async (records: unknown) => {
  if (
    typeof records !== "object" ||
    records === null ||
    !Array.isArray(records)
  ) {
    return null;
  }

  const recordsData = records.map((record) => {
    return {
      createdAt: record["Date"],
      categoryName: record["Category"],
      amount: record["Price"],
      description: record["Note"],
    };
  });

  const { success, data, error } =
    await importedRecordsSchema.safeParseAsync(recordsData);

  if (!success) {
    throw new Error(error.message);
  }

  return data;
};
