import React, { useEffect, useState } from "react";

interface ResetPasswordModalProps {
  reset: string | null;
  token: string | null;
  onClose: () => void;
}

interface Errors {
  newPassword?: string[]; 
  confirmPassword?: string; 
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ reset, token, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (reset === "true" && token) {
      setMessage("");
      setErrors({});
    }
  }, [reset, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload

    console.log('Form submitted');
    console.log('Token:', token);
    console.log('New Password:', newPassword);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Making the API call
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setMessage("Password successfully reset!");
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error during API call:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "newPassword") {
      setNewPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Clear the error for the specific field being typed in
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: undefined, // Clear the previous error for that field
    }));

    // Validate fields on change
    validateField(id, value);
  };

  const validateField = (id: string, value: string) => {
    let newErrors: Errors = {};

    switch (id) {
      case "newPassword":
        const passwordErrors: string[] = [];

        if (value.trim() === "") {
          passwordErrors.push("Password is required.");
        } else {
          if (value.length < 8) {
            passwordErrors.push("Password must be at least 8 characters long.");
          }
          if (!/[A-Z]/.test(value)) {
            passwordErrors.push("Password must include at least one uppercase letter.");
          }
          if (!/[a-z]/.test(value)) {
            passwordErrors.push("Password must include at least one lowercase letter.");
          }
          if (!/\d/.test(value)) {
            passwordErrors.push("Password must include at least one digit.");
          }
          if (!/[!@#$%^&*]/.test(value)) {
            passwordErrors.push("Password must include at least one special character (e.g., !, @, #, $, %, ^, &).");
          }
        }

        if (passwordErrors.length > 0) {
          newErrors = { ...newErrors, [id]: passwordErrors };
        }
        break;

      case "confirmPassword":
        if (value !== newPassword) {
          newErrors = { ...newErrors, [id]: "Passwords do not match." };
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  };

  if (!reset || !token) return null;

  return (
    <div
      id="authentication-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-md p-4 bg-white rounded-2xl shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reset Your Password
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-2xl text-sm p-2 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="mt-2 px-3 text-black py-2 border border-gray-300 rounded-2xl w-full"
                required
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.join(", ")}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="mt-2 px-3 text-black py-2 border border-gray-300 rounded-2xl w-full"
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="button" 
                className="text-sm text-white bg-[#822538] px-4 py-2 rounded-2xl"
                onClick={handleSubmit} 
              >
                Reset Password
              </button>
            </div>
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
