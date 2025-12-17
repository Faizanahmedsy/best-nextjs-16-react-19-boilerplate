/**
 * 🧪 **Example: Using the Automatic Token Refresh System**
 *
 * This file demonstrates how the global 401 error handling works in practice.
 * You can use these patterns in your Server Actions and API Routes.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { http } from "@/api/http";

/**
 * Extended Error type with additional properties for API errors
 */
interface ApiError extends Error {
  statusCode?: number;
  requiresReauth?: boolean;
}

/**
 * ✅ **Example 1: Simple GET Request**
 *
 * The token refresh happens automatically if the access token is expired.
 * You don't need to write any special logic!
 */
export async function getUserProfileExample() {
  try {
    // This call automatically handles 401 errors:
    // 1. If access token is valid → Returns data
    // 2. If access token expired (401) → Refreshes token → Retries → Returns data
    // 3. If refresh token expired → Throws error with requiresReauth flag
    const response = await http.get<{ id: number; name: string; email: string }>("/users/me");

    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    // Check if user needs to re-authenticate
    if ((error as ApiError).requiresReauth) {
      redirect("/login");
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user profile",
    };
  }
}

/**
 * ✅ **Example 2: POST Request with Form Data**
 *
 * Server Actions with form validation also get automatic token refresh.
 */
export async function updateProfileAction(formData: FormData) {
  "use server";

  // The http.post method handles:
  // 1. Form validation
  // 2. API call with automatic 401 handling
  // 3. Success callbacks
  // 4. Error handling
  return await http.post(
    "/users/profile",
    formData,
    // Your validation schema here
    {} as never,
    {
      onSuccess: async (_data) => {
        // Revalidate the profile page after successful update
        revalidatePath("/profile");
      },
    }
  );
}

/**
 * ✅ **Example 3: Multiple Parallel Requests**
 *
 * When making multiple requests at once, the token refresh is smart:
 * - If all requests get 401, only ONE refresh happens
 * - All requests wait for the refresh to complete
 * - All requests then retry with the new token
 */
export async function getDashboardDataExample() {
  try {
    // Make 3 API calls in parallel
    const [userResponse, postsResponse, statsResponse] = await Promise.all([
      http.get("/users/me"),
      http.get("/posts"),
      http.get("/stats"),
    ]);

    // If all 3 get 401 (expired token):
    // 1. First request triggers token refresh
    // 2. Other 2 requests wait for refresh to complete
    // 3. All 3 requests retry with new token
    // 4. All succeed and return data

    return {
      success: true,
      data: {
        user: userResponse.data,
        posts: postsResponse.data,
        stats: statsResponse.data,
      },
    };
  } catch (error) {
    if ((error as ApiError).requiresReauth) {
      redirect("/login");
    }

    return {
      success: false,
      error: "Failed to load dashboard data",
    };
  }
}

/**
 * ✅ **Example 4: Using the HTTP Client for GET by ID**
 *
 * The http client also has automatic token refresh built-in.
 */
export async function getPostByIdExample(postId: string) {
  try {
    const response = await http.get(`/posts/${postId}`);

    return {
      success: true,
      post: response.data,
    };
  } catch (error) {
    if ((error as ApiError).requiresReauth) {
      redirect("/login");
    }

    return {
      success: false,
      error: "Failed to fetch post",
    };
  }
}

/**
 * ✅ **Example 5: Error Handling with Different Status Codes**
 *
 * Handle different error scenarios appropriately.
 */
export async function deletePostExample(postId: string) {
  try {
    await http.delete(`/posts/${postId}`);

    revalidatePath("/posts");

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    const apiError = error as ApiError;

    // Handle different error types
    if (apiError.requiresReauth) {
      // Refresh token expired - redirect to login
      redirect("/login");
    } else if (apiError.statusCode === 403) {
      // Forbidden - user doesn't have permission
      return {
        success: false,
        error: "You don't have permission to delete this post",
      };
    } else if (apiError.statusCode === 404) {
      // Not found
      return {
        success: false,
        error: "Post not found",
      };
    } else {
      // Other errors
      return {
        success: false,
        error: apiError.message || "Failed to delete post",
      };
    }
  }
}

/**
 * ✅ **Example 6: Handling Token Refresh in Middleware (Optional)**
 *
 * You can also check token expiration in middleware if needed,
 * but it's not required since the API client handles it automatically.
 */
export async function checkAuthExample() {
  try {
    // This will automatically refresh if needed
    const response = await http.get("/auth/verify");

    return {
      isAuthenticated: true,
      user: response.data,
    };
  } catch (error) {
    if ((error as ApiError).requiresReauth) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    throw error;
  }
}

/**
 * 🎯 **Key Takeaways:**
 *
 * 1. ✅ You don't need to manually check token expiration
 * 2. ✅ You don't need to write retry logic
 * 3. ✅ You don't need to handle race conditions
 * 4. ✅ Just use http.get/post/patch/delete as normal
 * 5. ✅ Token refresh happens automatically on 401 errors
 * 6. ✅ Always check for requiresReauth flag in error handling
 * 7. ✅ Redirect to login when requiresReauth is true
 *
 * **That's it! The system handles everything else for you.** 🎉
 */
