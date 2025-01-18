"use client";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Pagination,
  Box,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../lib/api";
import { useSession } from "next-auth/react";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
  post_count: number;
  creator: User;
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    try {
      const result = await getCategories(page, limit);
      setCategories(result.categories);
      setTotalPages(result.pagination.total_pages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: categoryName });
      } else {
        await createCategory({ name: categoryName });
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  
  const canEditCategory = (category: Category) => {
    return currentUserId && category.creator.id === Number(currentUserId);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Categories
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Category
      </Button>
      <List>
        {categories.map((category) => (
          <ListItem 
            key={category.id} 
            divider
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ListItemText
              primary={`${category.name} (${category.post_count} posts)`}
              secondary={`Created by ${category.creator.username}`}
            />
            <Box>
              {canEditCategory(category) ? (
                <>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(category)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(category.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Tooltip title="Only the author can edit this category">
                  <span>
                    <Button
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                      disabled
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      disabled
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Page {page} of {totalPages}
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCategory ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

