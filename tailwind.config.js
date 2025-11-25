// module.exports = {
//   content: ["./src/**/*.{html,ts}"],
//   theme: {
//     extend: {
//       backgroundImage: {
//         'radial-pro': 'radial-gradient(1200px 600px at 50% 20%, rgba(255,120,60,.18), transparent 60%)'
//       },
//       colors: { brand: { DEFAULT: "#ff5a00" } },
//       boxShadow: { glow: "0 0 80px rgba(255,90,0,.15)" }
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        'radial-pro': 'radial-gradient(1200px 600px at 50% 20%, rgba(59,130,246,.18), transparent 60%)'
      },
      colors: { brand: { DEFAULT: "#3b82f6" } },
      boxShadow: { glow: "0 0 80px rgba(59,130,246,.12)" }
    },
  },
  plugins: [],
}
