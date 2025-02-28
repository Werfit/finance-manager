export type ActionResponse<T> =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: T;
    };
