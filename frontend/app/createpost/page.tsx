"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createPost } from "../lib/api";  

interface Post {
  id: number;
  title: string;
  content: string;
  creator: string;  
}

export default function AddPost() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setContent("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {
      const newPost = { title, content }; 
      await createPost(newPost);  
      handleClose();  
    } catch (error) {
      console.error("Error creating post:", error);
      setError("There was an error creating the post.");
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Post
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Post
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
