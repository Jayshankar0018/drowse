/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				black: {
					DEFAULT: "#000",
					100: "#1E1E2D",
					200: "#232533",
				},
				gray: {
					100: "#CDCDE0",
				},
				"robins-egg-blue": {
					50: "#effcfc",
					100: "#d7f6f6",
					200: "#b4eced",
					300: "#80dee0",
					400: "#50c9ce",
					500: "#29aab1",
					600: "#258995",
					700: "#246f7a",
					800: "#255b65",
					900: "#234d56",
					950: "#12333a",
				},

				olive: {
					50: "#f6f8f5",
					100: "#e1e7e0",
					200: "#c2cfc0",
					300: "#9baf99",
					400: "#748e73",
					500: "#5a7359",
					600: "#475b46",
					700: "#3a4b3a",
					800: "#313e31",
					BLACK: "#2e382e",
					950: "#161d16",
				},
				"orange-peel": {
					50: "#fffcea",
					100: "#fff4c5",
					200: "#ffe985",
					300: "#ffd746",
					400: "#ffc21b",
					500: "#ffa001",
					600: "#e27700",
					700: "#bb5202",
					800: "#983f08",
					900: "#7c340b",
					950: "#481900",
				},
			},
			fontFamily: {
				pthin: ["Poppins-Thin", "sans-serif"],
				pextralight: ["Poppins-ExtraLight", "sans-serif"],
				plight: ["Poppins-Light", "sans-serif"],
				pregular: ["Poppins-Regular", "sans-serif"],
				pmedium: ["Poppins-Medium", "sans-serif"],
				psemibold: ["Poppins-SemiBold", "sans-serif"],
				pbold: ["Poppins-Bold", "sans-serif"],
				pextrabold: ["Poppins-ExtraBold", "sans-serif"],
				pblack: ["Poppins-Black", "sans-serif"],
				dscript: ["Dancing-Script", "sans-serif"],
			},
		},
	},
	plugins: [],
};
