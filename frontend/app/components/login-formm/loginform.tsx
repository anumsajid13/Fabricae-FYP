"use client";
import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signInWithGoogle , signInWithLinkedIn ,getUserProfile} from '../../../utils/auth';
import { useAuthStore } from '../../store/authStore'; 

import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import "../../globals.css";

export function LoginFormDemo() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");


  const [formData, setFormData] = useState({
    email: "",
    password: ""  
  });

  const [errors, setErrors] = useState({

    email: "",
    password: ""  });

    const handleGoogleLogin = async () => {
      const { error } = await signInWithGoogle();
      if (error) {
        alert('Error during login');
      }
      else{

     
    router.push ('/')

      }
    };

    const handleLinkedInSignIn = async () => {

      const result = await signInWithLinkedIn();
      if (result.error) {
        alert('LinkedIn Sign-In failed');
      } else {
        router.push("/")

      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
  
       // Clear the error for the specific field being typed in
    setErrors((prev) => ({
      ...prev,
      [id]: "", // Clear the error for the current field
    }));
  
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
  
      // Validate fields on change
      validateField(id, value);
    };


    const validateField = (id: string, value: string) => {
      switch (id) {
     
        case "email":
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          setErrors((prev) => ({
            ...prev,
            email: value.trim() === ""
              ? "Email is required."
              : !emailRegex.test(value)
              ? "Please enter a valid email address."
              : "", // Placeholder for API call to check email uniqueness
          }));
          break;
  
          case "password":
            setErrors((prev) => {
              const errors: any = {};
          
              // Start with an empty array for password errors
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
          
              // If there are any password validation errors, add them to the errors object
              if (passwordErrors.length > 0) {
                errors.password = passwordErrors;
              }
              else
              {
                errors.password = "";
  
              }
          
              return { ...prev, ...errors };
            });
            break;
          
  
        default:
          break;
      }
    };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    //setError("");

    const updatedErrors: any = {};
    let hasErrors = false;

    // Validate all fields again
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (errors[key as keyof typeof errors]) {
        updatedErrors[key] = errors[key as keyof typeof errors];
        hasErrors = true;
      }
    });

    // Set errors state
    setErrors(updatedErrors);

    if (hasErrors) {
      setErrorMessage("Please correct the highlighted errors before submitting.");
      console.log("Validation failed:", updatedErrors);
      return; // Stop form submission
    }

    // Clear error message before making the API request
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error:", errorData.message);
        setErrorMessage(errorData.message || "An error occurred. Please try again.");
      }

      const { token, user } = await response.json();
      console.log('token is', token);
  
      // Set the token in the Zustand store
      useAuthStore.getState().setToken(token);

      localStorage.setItem("userEmail", user.email);
  
      // Redirect to the home page
      router.push('/');
      
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-4xl w-full mx-auto mt-20 mb-20 min-h-screen rounded-none md:rounded-2xl bg-black shadow-lg overflow-hidden">
      {/* Left column with cover image */}
      <div className="w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login.jpg')" }}>
       
        <div className="h-full w-full bg-opacity-60 bg-black flex items-center justify-center">
        </div>
      </div>

      {/* Right column with form */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-start justify-center bg-[#E7E4D8]">
        <h2 className="font-bold text-3xl text-black">Welcome to Fabricae</h2>
        <p className="text-sm max-w-sm mt-2 text-black">
          Create an Account if you want to Login!
        </p>

        <form className="my-8 w-full" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label className="text-black" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="haniya911@gmail.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="custom-radiusI"
            />
          {errors.email && <p className="text-sm text-[#822538]">{errors.email}</p>}

          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label className="text-black" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="custom-radiusI"
            />
             {errors.password && <p className="text-sm text-[#822538]">{errors.password}</p>}

          </LabelInputContainer>

          {/* Error Message */}
          {error && (
            <div className="bg-black text-white rounded-md p-2 mb-4 text-sm">
              {error}
            </div>
          )}


          {errorMessage && (
        <div className="bg-black text-white p-2 rounded mt-2">
          {errorMessage}
        </div>
          )}

          <button
            className={`bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] custom-radiusI ${
              loading && "opacity-50 pointer-events-none"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login →"}
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#822538] shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
              type="button"
              onClick={handleGoogleLogin}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
              <span className="text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>

            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#822538] shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
              type="button"
              onClick={handleLinkedInSignIn}
            >
              <IconBrandLinkedin className="h-4 w-4 text-neutral-300" />
              <span className="text-neutral-300 text-sm">LinkedIn</span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};