"use client";

import { cleanContent } from "@/lib/utils";
import { Comment, Post } from "@/types";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  createComment,
  deletePost,
  deleteComment,
  getPost,
  updateComment,
} from "../../lib/api";

const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [errors, setErrors] = useState<Partial<CommentFormData>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CommentFormData>({
    content: "",
  });
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const router = useRouter();
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  const { id } = params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) {
          setGeneralError("Invalid post ID");
          return;
        }
        
        const postData = await getPost(id);
        if (!postData?.id) {
          throw new Error("Invalid post response");
        }
        setPost(postData);
      } catch (error) {
        console.error("Failed to load post:", error);
        setGeneralError("Failed to load post data");
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    
    if (!id) {
      setGeneralError("Missing post ID");
      return;
    }

    setIsLoading(true);

    try {
      commentSchema.parse(formData);

      if (editingCommentId) {
        await updateComment(id, editingCommentId, formData.content);
      } else {
        await createComment(id, formData.content);
      }

      const updatedPost = await getPost(id);
      if (!updatedPost?.id) {
        throw new Error("Failed to fetch updated post");
      }
      setPost(updatedPost);
      setFormData({ content: "" });
      setEditingCommentId(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors as Partial<CommentFormData>);
      } else {
        setGeneralError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!id) {
      setGeneralError("Missing post ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        router.push("/");
      } catch (err) {
        console.error("Error deleting post:", err);
        setGeneralError("Failed to delete post");
      }
    }
  };

  const handleEditComment = (comment: Comment) => {
    if (!comment?.id) return;
    setFormData({ content: comment.content });
    setEditingCommentId(comment.id);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) {
      setGeneralError("Missing comment ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
        const updatedPost = await getPost(id || '');
        setPost(updatedPost);
      } catch (err) {
        console.error("Error deleting comment:", err);
        setGeneralError("Failed to delete comment");
      }
    }
  };

  if (!post) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading post...</Typography>
      </Box>
    );
  }

  const userOwnsPost = session && post.author?.id === session?.user?.id;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {new Date(post.createdAt).toLocaleDateString()} | 
          Author: {post.author?.name || "Unknown author"} | 
          Comments: ({post._count?.comments || 0}) | 
          Category: {post.category?.name || "Uncategorized"}
          {userOwnsPost && post?.id && (
            <>
              | <Link href={`/posts/edit/${post.id}`}>Edit</Link> |{" "}
              <Link href="#" onClick={handleDeletePost}>
                Delete
              </Link>
            </>
          )}
        </Typography>
        <Box
          sx={{ mt: 2 }}
          dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }}
        />
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom>
        Comments
      </Typography>
      {post.comments?.length ? (
        <List>
          {post.comments?.map((comment) => (
            <ListItem
              key={comment.id}
              secondaryAction={
                session &&
                comment.author?.id === session.user?.id && (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditComment(comment)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
            >
              <ListItemText
                primary={comment.author?.name || "Anonymous"}
                secondary={comment.content}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No comments yet!</Typography>
      )}

      {session ? (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" component="h3" gutterBottom>
            {editingCommentId ? "Edit Comment" : "Add a Comment"}
          </Typography>
          {generalError && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {generalError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmitComment}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your comment here..."
              sx={{ mb: 2 }}
              name="content"
              value={formData.content}
              onChange={handleChange}
              error={!!errors.content}
              helperText={errors.content}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading
                ? "Submitting..."
                : editingCommentId
                ? "Update Comment"
                : "Submit Comment"}
            </Button>
            {editingCommentId && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingCommentId(null);
                  setFormData({ content: "" });
                }}
                sx={{ ml: 2 }}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Typography variant="body1">
          Please <Link href="/login">login</Link> to add a comment
        </Typography>
      )}
    </Box>
  );
}