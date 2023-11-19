import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Modal,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const PostModal = ({ isOpen, handleClose, post }) => {
  return (
    <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
      <Fade in={isOpen}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5">{post?.title}</Typography>
          <Typography variant="body1">{post?.body}</Typography>
        </div>
      </Fade>
    </Modal>
  );
};

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("Asia/Kolkata");
  const [userPosts, setUserPosts] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [countries, setCountries] = useState([]);
  const [isClockPaused, setClockPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(null);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error));

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => response.json())
      .then((posts) => setUserPosts(posts))
      .catch((error) => console.error("Error fetching user posts:", error));

    const fetchCountries = async () => {
      try {
        const response = await fetch("http://worldtimeapi.org/api/timezone");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [userId]);

  useEffect(() => {
    let interval;

    const fetchTime = async () => {
      try {
        const response = await fetch(
          `http://worldtimeapi.org/api/timezone/${selectedCountry}`
        );
        const data = await response.json();

        const offsetString = data.utc_offset;
        const [hours, minutes] = offsetString.split(":").map(Number);
        const offsetMilliseconds = (hours * 60 + minutes) * 60 * 1000;

        const currentUtcTime = new Date().getTime();
        const adjustedTime = new Date(currentUtcTime + offsetMilliseconds);

        setCurrentTime(adjustedTime.toISOString());
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();

    const startClock = () => {
      interval = setInterval(fetchTime, 1000);
    };

    const pauseClock = () => {
      clearInterval(interval);
      setPausedTime(currentTime);
    };

    if (isClockPaused) {
      setCurrentTime(pausedTime);
    } else {
      startClock();
    }

    return () => {
      pauseClock();
    };
  }, [isClockPaused, pausedTime, selectedCountry, userId, currentTime]);

  const toggleClock = () => {
    setClockPaused((prevPaused) => !prevPaused);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setPausedTime(null);
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 2 }}>
      {userData && (
        <>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={3}>
              <IconButton
                component={RouterLink}
                to="/"
                color="primary"
                aria-label="back"
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                fullWidth
                label="Select Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography
                // variant="body1"
                sx={{ display: "flex", mb: 1, letterSpacing: "4px" }}
                className={isClockPaused ? "glow" : "date"}
              >
                {formatTime(currentTime)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <IconButton onClick={toggleClock} color="primary">
                {isClockPaused ? <PlayArrowIcon /> : <PauseIcon />}
              </IconButton>
              <Typography variant="body1" component="span">
                {isClockPaused ? "Play" : "Pause"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} item xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Profile Details
              </Typography>
              <Card
                sx={{
                  boxShadow: "none",
                  border: "1px solid #d5d5d5",
                  width: "100%",
                }}
              >
                <CardContent
                  style={{
                    padding: 8,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item xs={12} md={9}>
                    <Typography variant="body1" sx={{ display: "flex", mb: 1 }}>
                      <PersonIcon sx={{ mr: 1 }} /> {userData.name}
                    </Typography>
                    <Typography variant="body1" sx={{ display: "flex", mb: 1 }}>
                      <AlternateEmailIcon sx={{ mr: 1 }} /> {userData.username}
                    </Typography>
                    <Typography variant="body1" sx={{ display: "flex", mb: 1 }}>
                      <VerifiedIcon sx={{ mr: 1 }} />{" "}
                      {userData.company.catchPhrase}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1" sx={{ display: "flex", mb: 1 }}>
                      <PlaceIcon sx={{ mr: 1 }} />
                      {userData.address.suite} {userData.address.street}{" "}
                      {userData.address.city} {userData.address.zipcode}
                    </Typography>
                    <Typography variant="body1" sx={{ display: "flex", mb: 1 }}>
                      <LocalPhoneIcon sx={{ mr: 1 }} /> {userData.phone}
                    </Typography>
                    <Typography variant="body1" sx={{ display: "flex", mb: 1 }}>
                      <EmailIcon sx={{ mr: 1 }} /> {userData.email}
                    </Typography>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
           
          <Grid container spacing={2}>
            {userPosts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    boxShadow: "none",
                    border: "1px solid #d5d5d5",
                    width: "100%",
                  }}
                >
                  <CardContent
                    style={{
                      minHeight: "9rem",
                    }}
                    sx={{
                      "&:hover, &:focus": {
                        backgroundColor: "#e8ffec",
                        border: "1px solid #78ff88",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handlePostClick(post)}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2">{post.body}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <PostModal
            isOpen={isPostModalOpen}
            handleClose={handleClosePostModal}
            post={selectedPost}
          />
        </>
      )}
    </Container>
  );
};

export default UserProfile;
