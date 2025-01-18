import { apiUrl } from "@/utils/env";
import { getSession } from "next-auth/react";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();

  const headers = new Headers(options.headers);
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "An error occurred");
  }

  return response.json();
}

export const createCategory = async (data: { name: string }) => {
  return fetchWithAuth("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCategories = async (page: number = 1, limit: number = 10) => {
  return fetchWithAuth(`/categories?page=${page}&limit=${limit}`);
};

export const updateCategory = async (id: number, data: { name: string }) => {
  const response = await fetchWithAuth(`/categories/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update category');
  }

  return response.json();
};

export const deleteCategory = async (id: number) => {
  return fetchWithAuth(`/categories/${id}`, {
    method: "DELETE",
  });
};

export const getPosts = async (page: number = 1, limit: number = 10) => {
  return fetchWithAuth(`/posts?page=${page}&limit=${limit}`);
};

