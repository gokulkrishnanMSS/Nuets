/** Response body of `POST /food/identify`. */
export type FoodIdentification = {
  result: string;
  filename: string;
  device: string;
};

export type IdentifyFoodRequest = {
  /** Filesystem path from the camera (without the `file://` scheme). */
  filePath: string;
  prompt?: string;
  maxNewTokens?: number;
  signal?: AbortSignal;
};
