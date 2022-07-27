const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
  },

  plugins: [require('daisyui')],

  darkMode: 'class',

  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#f3410e",
          "secondary": "#009fe5",
          "accent": "#C148AC",
          "neutral": "#021431",
          "base-100": "#ffffff",
          "base-200": "#F2F7FF",
          "base-300": "#E3E9F4",
          "base-content": "#394E6A",
          "info": "#93E7FB",
          "success": "#81CFD1",
          "warning": "#EFD7BB",
          "error": "#CE0023",
        },
      },
    ],
  },
};

module.exports = config;
