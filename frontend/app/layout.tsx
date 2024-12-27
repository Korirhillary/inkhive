"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import React from "react";
import theme from "./theme";
import AppHeader from "./AppHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <AppBar position="sticky">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link
                      href="/"
                      passHref
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      InkHive
                    </Link>
                  </Typography>
                  <Button color="inherit" component={Link} href="/categories">
                    Categories
                  </Button>
                  <Button color="inherit" component={Link} href="/create-post">
                    Create Post
                  </Button>
                  <Button color="inherit" component={Link} href="/profile">
                    Profile
                  </Button>
                </Toolbar>
              </AppBar>
              <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {children}
              </Container>
              <Box
                component="footer"
                sx={{
                  py: 3,
                  px: 2,
                  mt: "auto",
                  backgroundColor: "background.paper",
                }}
              >
                <Container maxWidth="sm">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    © {new Date().getFullYear()} InkHive
                  </Typography>
                </Container>
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
