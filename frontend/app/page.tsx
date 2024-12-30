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
import { getCategories, getPosts } from "./lib/api";

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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, postsData] = await Promise.all([
          getCategories(),
          getPosts()
        ]);
        setCategories(categoriesData);
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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

