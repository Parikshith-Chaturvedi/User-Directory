import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Link,
  CircularProgress,
} from "@mui/material";

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
          const usersWithPostsPromise = data.map((user) =>
            fetch(
              `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
            )
              .then((response) => response.json())
              .then((posts) => ({ ...user, postsCount: posts.length }))
          );

          return Promise.all(usersWithPostsPromise);
        })
        .then((usersWithPosts) => {
          setUsers(usersWithPosts);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }, 1500);

    return () => clearTimeout(delay);
  }, []);
  return (
    <Container maxWidth="md" style={{ paddingTop: "20px" }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Directory
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          users.map((user) => (
            <Grid item key={user.id} xs={12} sm={12} md={12} lg={12}>
              <Card
                sx={{
                  mb: 2,
                  transition: "background-color 0.3s",
                  boxShadow: "none",
                  border: "1px solid #d5d5d5",
                }}
              >
                <Link
                  component={RouterLink}
                  to={`/user/${user.id}`}
                  underline="none"
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover, &:focus": {
                      backgroundColor: "#e8ffec",
                      border: "1px solid #78ff88",
                    },
                  }}
                >
                  <CardContent
                    style={{
                      padding: 8,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1" component="div">
                      {user.name}
                    </Typography>
                    <Typography color="textSecondary" align="right">
                      Posts: {user.postsCount || 0}
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default UserDirectory;
