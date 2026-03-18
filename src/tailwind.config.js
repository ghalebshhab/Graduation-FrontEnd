/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}", // This line is critical!
];
export const theme = {
  extend: {
    colors: {
      "jomap-blue": "#40A9FF",
      "jomap-dark": "#121212",
      "jomap-card": "#1c1c1c",
    },
  },
};
export const plugins = [];
/** @type {import('tailwindcss').Config} */
