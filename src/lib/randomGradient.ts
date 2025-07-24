export const generateRandomGradient = () => {
  const color1 = Math.floor(Math.random() * 16777215).toString(16);
  const color2 = Math.floor(Math.random() * 16777215).toString(16);
  return `linear-gradient(45deg, #${color1}, #${color2})`;
};
