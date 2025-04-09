import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// This function now just checks if the user is authenticated via API
export async function isAuthenticated() {
  try {
    console.log("isAuthenticated: Starting authentication check...");
    
    // Check if we have a user in localStorage as a fallback
    const userFromStorage = localStorage.getItem("user");
    console.log("isAuthenticated: User from localStorage:", userFromStorage ? "Found" : "Not found");
    
    console.log("isAuthenticated: Sending request to check-auth endpoint...");
    const response = await fetch('http://localhost:5000/api/auth/check-auth', {
      credentials: 'include', // Important: This sends cookies with the request
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("isAuthenticated: Response status:", response.status);
    console.log("isAuthenticated: Response headers:", [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log("isAuthenticated: Response data:", data);
      return data.success === true;
    }
    
    console.log("isAuthenticated: Authentication failed with status:", response.status);
    return false;
  } catch (error) {
    console.error("isAuthenticated: Error during authentication check:", error);
    return false;
  }
}

// This function is no longer needed as we're using cookies
export function getAuthToken() {
  return null; // We don't need to manually get the token anymore
}

// This function now calls the logout API endpoint
export async function logout() {
  try {
    console.log("logout: Starting logout process...");
    const response = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("logout: Response status:", response.status);
    
    if (response.ok) {
      console.log("logout: Logout successful");
      // Clear any local storage data
      localStorage.removeItem("user");
    } else {
      console.error("logout: Logout failed with status:", response.status);
    }
  } catch (error) {
    console.error("logout: Error during logout:", error);
  }
}
