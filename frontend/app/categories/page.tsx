"use client";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  Box,
  Snackbar,
  Alert,
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

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });
  const limit = 10;
  
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await getCategories(page, limit);
      setCategories(result.categories);
      setTotalPages(result.pagination.total_pages);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showAlert("Failed to load categories", "error");
    } finally {
      setLoading(false);
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

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      showAlert("Category name cannot be empty", "error");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: categoryName });
        showAlert("Category updated successfully", "success");
      } else {
        await createCategory({ name: categoryName });
        showAlert("Category created successfully", "success");
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Error saving category:", error);
      showAlert(
        `Failed to ${editingCategory ? 'update' : 'create'} category`,
        "error"
      );
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      showAlert("Category deleted successfully", "success");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      showAlert("Failed to delete category", "error");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const canEditCategory = (category: Category) => {
    return currentUserId && category.creator.id === Number(currentUserId);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Categories
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Category
          </Button>
        </Box>

        {loading ? (
          <List>
            {[...Array(5)].map((_, index) => (
              <ListItem key={index} divider>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="20%" height={40} sx={{ ml: 2 }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Card>
            <List>
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  divider
                  secondaryAction={
                    <Tooltip title={canEditCategory(category) ? "More actions" : "Only the creator can edit this category"}>
                      <span>
                        <IconButton
                          edge="end"
                          onClick={(e) => handleMenuClick(e, category)}
                          disabled={!canEditCategory(category)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={category.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {category.post_count} posts
                        </Typography>
                        {" • "}
                        <Typography component="span" variant="body2">
                          Created by {category.creator.username}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        )}

        {!loading && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Page {page} of {totalPages}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedCategory && handleEdit(selectedCategory)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedCategory && handleDeleteClick(selectedCategory)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

