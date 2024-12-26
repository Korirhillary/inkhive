import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#335c67", // Deep blue
    },
    secondary: {
      main: "#ff6f00", // Amber
    },
    background: {
      default: "#f5f5f5", // Light grey
      paper: "#ffffff", // White
    },
    text: {
      primary: "#212121", // Dark grey
      secondary: "#757575", // Medium grey
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

export default theme;
