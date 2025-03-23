type Success<T> = {
  success: true;
  data: T;
};

type Failure<E extends Error> = {
  success: false;
  error: E;
};

export const tryCatch = async <T, E extends Error = Error>(
  fn: () => Promise<T>
): Promise<Success<T> | Failure<E>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: processError(error) as E };
  }
};

const processError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
};
