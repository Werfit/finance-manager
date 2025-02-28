import { parse } from "csv-parse";

export const parseCsv = async (file: File) => {
  return new Promise(async (resolve, reject) => {
    const text = await file.text();
    const records: unknown[] = [];

    const parser = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on("error", reject);
    parser.on("end", () => {
      resolve(records);
    });
  });
};
