import { FieldError } from "react-hook-form";

export const extractCategoryError = (
  error: FieldError | undefined
): string | undefined => {
  if (!error) {
    return undefined;
  }

  if ("message" in error) {
    return error.message;
  }

  const error_ = error as {
    min?: FieldError;
    max?: FieldError;
  };

  if ("min" in error_) {
    return error_.min?.message;
  }

  if ("max" in error_) {
    return error_.max?.message;
  }

  return undefined;
};
