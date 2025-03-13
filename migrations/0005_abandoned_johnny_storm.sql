CREATE TYPE "public"."category_type" AS ENUM('income', 'expense');--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "type" "category_type";

-- Set default type to 'expense' for existing categories
UPDATE "categories" SET "type" = 'expense';

-- Update "records" table to ensure all amount values are positive
UPDATE "records" SET "amount" = ABS("amount");