import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SignUppage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required!";
    } else if (!/^[a-zA-Z\s]{3,}$/.test(formData.name)) {
      newErrors.name = "Full Name must be at least 3 letters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format!";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required!";
    } else if (!/^(?=.*[A-Z]).{6,}$/.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters and include one uppercase letter!";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required!";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(formData);

      toast.success(response.data.message || "Registration successful!");
      

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-farm-green-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-farm-green-500">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-farm-green-700">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-farm-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
            />
            {errors.name && (
              <small className="text-red-500 text-sm">{errors.name}</small>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-farm-green-700">
              Email address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-farm-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
            {errors.email && (
              <small className="text-red-500 text-sm">{errors.email}</small>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-farm-green-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-farm-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Create a strong password"
            />
            {errors.password && (
              <small className="text-red-500 text-sm">{errors.password}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-farm-green-700">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-farm-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green-500"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <small className="text-red-500 text-sm">
                {errors.confirmPassword}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-farm-green-500 hover:bg-farm-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Register
          </button>

          <p className="text-center text-sm mt-4 text-farm-green-700">
            Already have an account?{" "}
            <Link to="/login" className="text-farm-green-500 hover:text-farm-green-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUppage;
