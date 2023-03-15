import React from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Avatar,
} from "@mui/material";

export default function Signup() {
  return (
    <>
      <div className="Signup" style={{ marginTop: "10%" }}>
        <Paper
          elevation={3}
          style={{
            width: "50%",
            margin: "auto",
            padding: "50px",
            align: "space-between",
          }}
        >
          <Avatar
            sx={{
              margin: "auto",
              marginBottom: "20px",
              width: "50px",
              height: "50px",
              bgcolor: "black",
            }}
          ></Avatar>
          <Typography variant="h4" component="h1" align="center">
            Sign up
          </Typography>
          <form>
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                margin="normal"
                required
                id="name"
                label="Username"
                name="name"
                autoComplete="name"
                autoFocus
                className="login-field"
              />
              <TextField
                margin="normal"
                required
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                className="login-field"
              />
              <TextField
                margin="normal"
                required
                id="password"
                label="Password"
                type={"password"}
                name="email"
                autoComplete="email"
                autoFocus
                className="login-field"
              />
            </Box>
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "20%" }}
              >
                Sign up
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </>
  );
}
