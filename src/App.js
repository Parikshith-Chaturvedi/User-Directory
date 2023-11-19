// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UserDirectory from "./UserDirectory";
import UserProfile from "./UserProfile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00c853",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<UserDirectory />} />
          <Route path="/user/:userId/*" element={<UserProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
