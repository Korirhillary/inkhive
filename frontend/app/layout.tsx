"use client";

import { Box, Container, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import React from "react";
import AppHeader from "./AppHeader";
import theme from "./theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
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
                <AppHeader />
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
                      © {new Date().getFullYear()} InkHive, All rights reserved.
                    </Typography>
                  </Container>
                </Box>
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
