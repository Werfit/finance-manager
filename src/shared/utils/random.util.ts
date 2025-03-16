/**
 *
 * @param min Min is inclusive
 * @param max Max is inclusive
 */
export const generateRandomNumber = (min: number, max: number): number => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

export const generateRandomDate = (from: Date, to: Date) => {
  const startTime = from.getTime();
  const endTime = to.getTime();
  const randomTime = generateRandomNumber(startTime, endTime);

  return new Date(randomTime);
};
