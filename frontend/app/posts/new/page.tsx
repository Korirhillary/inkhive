"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { z } from "zod";
import { createPost, getCategories } from "@/lib/api";
import type { Category } from "@/types";
import { useSession } from "next-auth/react";

// Define the schema for post validation
const postSchema = z.object({
  categoryId: z.union([z.string(), z.number()]).refine((val) => val !== "", "Category is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

// Infer the type for form data based on the schema
type PostFormData = z.infer<typeof postSchema>;

interface CategoryResponse {
  pagination: {
    // Add pagination fields if needed
  };
  categories: Category[];
}

// Custom hook to manage post form state and logic
const usePostForm = () => {
  const [formData, setFormData] = useState<PostFormData>({
    categoryId: "", // Changed to an empty string
    title: "",
    content: "",
  });
  
  const [errors, setErrors] = useState<Partial<PostFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const router = useRouter();
  const { data: session, status } = useSession();

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await getCategories();
        if (response && typeof response === "object" && "categories" in response) {
          const categoryResponse = response as CategoryResponse;
          setCategories(categoryResponse.categories);
          // Optionally set the first category as default if needed:
          if (categoryResponse.categories.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: categoryResponse.categories[0].id }));
          }
        } else {
          console.error("Unexpected response format for categories:", response);
          setGeneralError("Failed to load categories. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setGeneralError("Failed to load categories. Please try again later.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle category selection changes
  const handleCategoryChange = useCallback((event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      categoryId: value === "" ? "" : Number(value), // Ensure it's a number or empty string
    }));
    setErrors((prevErrors) => ({ ...prevErrors, categoryId: undefined }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    if (status !== "authenticated") {
      setGeneralError("You must be logged in to create a post.");
      setIsLoading(false);
      return;
    }

    try {
      postSchema.parse(formData); // Validate form data

      // Prepare the post data for submission
      const postData = {
        title: formData.title,
        content: formData.content,
        category_id: Number(formData.categoryId), // Matches the server schema name
        published: true,
      };

      // Create the post using the API
      const post = await createPost(postData);

      // Redirect to the newly created post
      router.push(`/posts/${post.id}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors as Partial<PostFormData>);
      } else {
        console.error("Unexpected error:", err);
        setGeneralError("An unexpected error occurred while creating the post. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    categories,
    errors,
    isLoading,
    isCategoriesLoading,
    generalError,
    handleChange,
    handleCategoryChange,
    handleSubmit,
    status,
  };
};

// Main component for creating a new post
export default function NewPost() {
  const {
    formData,
    categories,
    errors,
    isLoading,
    isCategoriesLoading,
    generalError,
    handleChange,
    handleCategoryChange,
    handleSubmit,
    status,
  } = usePostForm();

  if (status === "loading" || isCategoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Please sign in to create a post.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 900 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add Post
        </Typography>
        {generalError && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {generalError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="categoryId"
              value={formData.categoryId.toString()} // Convert to string for MUI Select
              label="Category"
              onChange={handleCategoryChange}
              error={!!errors.categoryId}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <Typography variant="caption" color="error">
                {errors.categoryId}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Content"
            name="content"
            variant="outlined"
            margin="normal"
            multiline
            rows={7}
            value={formData.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish Post"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}