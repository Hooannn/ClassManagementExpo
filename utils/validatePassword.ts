export const validatePassword = (str: string) => {
  return str.trim().length >= 6;
};
