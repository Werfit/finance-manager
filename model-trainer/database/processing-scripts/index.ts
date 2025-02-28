import fs from "node:fs";
import path from "node:path";
import * as csv from "fast-csv";

type Row = {
  user_id: string;
  created_at: string;
  category: string;
  amount: string;
};

const updateSyntheticTime = (csvPath: string, outputCsvPath: string) => {
  const outputDir = path.dirname(outputCsvPath);

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stream = fs.createWriteStream(path.resolve(outputCsvPath));

  fs.createReadStream(path.resolve(csvPath))
    .pipe(csv.parse<Row, Row>({ headers: true }))
    .transform((row, next) => {
      // Convert created_at to ISO format
      const isoDate = new Date(row.created_at).toISOString();
      next(null, { ...row, created_at: isoDate });
    })
    .pipe(csv.format<Row, Row>({ headers: true }))
    .pipe(stream)
    .on("finish", () => console.log("Finished processing"));
};

const removeTimestamps = (csvPath: string, outputCsvPath: string) => {
  const outputDir = path.dirname(outputCsvPath);

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stream = fs.createWriteStream(path.resolve(outputCsvPath));

  fs.createReadStream(path.resolve(csvPath))
    .pipe(csv.parse<Row, Row>({ headers: true }))
    .transform((row, next) => {
      // Convert created_at to ISO format
      const date = new Date(row.created_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;

      next(null, {
        ...row,
        created_at: `${year}-${formattedMonth}-${formattedDay}`,
      });
    })
    .pipe(csv.format<Row, Row>({ headers: true }))
    .pipe(stream)
    .on("finish", () => console.log("Finished processing"));
};

// updateSyntheticTime("../datasets/synthetic.csv", "../datasets/test-synth.csv");
removeTimestamps(
  "../datasets/final.csv",
  "../datasets/final-without-timestamp.csv"
);
