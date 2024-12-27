"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

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
            DuBlog
          </Link>
        </Typography>
        <Button color="inherit" component={Link} href="/categories">
          Categories
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
          <>
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}