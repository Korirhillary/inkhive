"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AppHeader() {
  const { data: session } = useSession();

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            href="/"
            passHref
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Inkhive
          </Link>
        </Typography>
        <Button color="inherit" component={Link} href="/categories">
          Categories
        </Button>
        <Button color="inherit" component={Link} href="/createpost">
          createpost
        </Button>
        {session ? (
          <>
            <Button color="inherit" component={Link} href="/categories/new">
              Add Category
            </Button>
            <Button color="inherit" component={Link} href="/articles/new">
              Write Article
            </Button>
            <Button
              color="inherit"
              onClick={async () => {
                await signOut({ redirect: false });
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
            <Box sx={{ height: "1em" }} />
            <Button color="inherit" component={Link} href="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
