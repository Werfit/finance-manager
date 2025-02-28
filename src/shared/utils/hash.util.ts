import bcrypt from "bcryptjs";

export const hash = async (value: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(value, salt);
};

export const compare = async (hash: string, value: string) => {
  return bcrypt.compare(value, hash);
};
