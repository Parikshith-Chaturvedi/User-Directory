import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [userPosts, setUserPosts] = useState([]); 
  const [timezones, setTimezones] = useState([]); 
  const [currentTime, setCurrentTime] = useState("");
  const [clockPaused, setClockPaused] = useState(false);
  console.log("userData", userData);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error));

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => response.json())
      .then((posts) => setUserPosts(posts))
      .catch((error) => console.error("Error fetching user posts:", error));

    fetch("http://worldtimeapi.org/api/timezone")
      .then((response) => response.json())
      .then((data) => setTimezones(data))
      .catch((error) => console.error("Error fetching timezones:", error));
  }, [userId]);

  const fetchCurrentTime = () => {
    if (selectedCountry && !clockPaused) {
      fetch(`http://worldtimeapi.org/api/timezone/${selectedCountry}`)
        .then((response) => response.json())
        .then((data) => setCurrentTime(data.datetime))
        .catch((error) => console.error("Error fetching current time:", error));
    }
  };

  useEffect(() => {
    fetchCurrentTime();
    const intervalId = setInterval(fetchCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, [selectedCountry, clockPaused]);

  const handleCountryChange = (event) => {
    const selectedCountryValue = event.target.value;
    setSelectedCountry(selectedCountryValue);
    fetchCurrentTime(selectedCountryValue);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedCountry) {
        fetch(`http://worldtimeapi.org/api/timezone/${selectedCountry}`)
          .then((response) => response.json())
          .then((data) => setCurrentTime(data.datetime))
          .catch((error) =>
            console.error("Error fetching current time:", error)
          );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selectedCountry]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <Container maxWidth="md">
      {userData && (
        <>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <IconButton
                component={RouterLink}
                to="/"
                color="primary"
                aria-label="back"
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" gutterBottom>
                {userData.name}'s Profile
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Username: {userData.username}
              </Typography>
              <Typography variant="body1">Email: {userData.email}</Typography>
              <Typography variant="body1">Phone: {userData.phone}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Country Clock Selector:</Typography>
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                fullWidth
              >
                {timezones.map((timezone) => (
                  <MenuItem key={timezone} value={timezone}>
                    {timezone}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Current Time:</Typography>
              <Typography variant="h4" align="center">
                {formatTime(currentTime)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={4}>
            {userPosts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body2">{post.body}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default UserProfile;
