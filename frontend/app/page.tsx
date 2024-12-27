"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCategories } from "./lib/api";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
}

interface Category {
  id: number;
  name: string;
  postCount: number;
}

const posts: Post[] = [
  {
    id: 1,
    title: "First Post",
    excerpt: "This is the first post",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Second Post",
    excerpt: "This is the second post",
    author: "Jane Smith",
  },
  {
    id: 3,
    title: "Third Post",
    excerpt: "This is the third post",
    author: "Bob Johnson",
  },
  {
    id: 4,
    title: "Fourth Post",
    excerpt: "This is the fourth post",
    author: "Alice Brown",
  },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Latest Posts
        </Typography>
        <Box>
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.excerpt}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    By {post.author}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Read More</Button>
                </CardActions>
              </Card>
              {index < posts.length - 1 && <Divider sx={{ my: 2 }} />}
            </React.Fragment>
          ))}
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Categories
          </Typography>
          <List>
            {categories.map((category) => (
              <ListItem key={category.id} disablePadding sx={{ mb: 1 }}>
                <ListItemText primary={category.name} />
                <Chip
                  label={`${category.postCount} posts`}
                  size="small"
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Grid>
  );
}
