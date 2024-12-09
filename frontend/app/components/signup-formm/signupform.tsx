"use client";
import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle, IconBrandLinkedin } from "@tabler/icons-react";
import '../../globals.css';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle ,signInWithLinkedIn} from '../../../utils/auth';

export function SignupFormDemo() {

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");


  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password1: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password1: "",
  });

  const handleGoogleRegister = async () => {
    const { error } = await signInWithGoogle();
    router.push("/");

    if (error) {
      alert('Error during registration');
    }
  };

  
  const handleLinkedRegister= async () => {

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
      case "firstname":
      case "lastname":
        // Check if the name contains only alphabets and is between 2–50 characters
        const nameRegex = /^[A-Za-z]{2,50}$/;
        setErrors((prev) => ({
          ...prev,
          [id]: value.trim() === ""
            ? `${id.charAt(0).toUpperCase() + id.slice(1)} is required.`
            : !nameRegex.test(value)
            ? `${id.charAt(0).toUpperCase() + id.slice(1)} should only contain alphabets and be between 2-50 characters.`
            : "",
        }));
        break;

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
        

      case "password1":
        // Confirm password should match password
        setErrors((prev) => ({
          ...prev,
          password1: value !== formData.password
            ? "Passwords do not match."
            : "",
        }));
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form submitted successfully:", data);
        router.push("/Login");
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData.message);
        setErrorMessage(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.log("Network error:", error);
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-4xl w-full mx-auto mt-20 mb-20 rounded-none md:rounded-2xl bg-[#E7E4D8] shadow-lg overflow-hidden">
      {/* Left column with cover image */}
      <div className="w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login2.jpg')" }}>
        <div className="h-full w-full bg-opacity-60 bg-black flex items-center justify-center"></div>
      </div>

      {/* Right column with form */}
      <div className="w-full md:w-1/2 p-4 md:p-8">
        <h2 className="font-bold text-3xl text-black">Welcome Back!</h2>
        <Link href="/Login">
        <p className="text-sm max-w-sm mt-2 text-black">
          Login to Fabricae if you already have an account!
        </p>
        </Link>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label className="black" htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Tyler"
                type="text"
                className="custom-radiusI"
                value={formData.firstname}
                onChange={handleChange}
              />
              {errors.firstname && <p className="text-sm text-[#822538]">{errors.firstname}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label className="text-black" htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Durden"
                type="text"
                className="custom-radiusI"
                value={formData.lastname}
                onChange={handleChange}
              />
              {errors.lastname && <p className="text-sm text-[#822538]">{errors.lastname}</p>}
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label className="text-black" htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="haniya911@gmail.com"
              type="email"
              className="custom-radiusI"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-sm text-[#822538]">{errors.email}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label className="text-black" htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              className="custom-radiusI"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-sm text-[#822538]">{errors.password}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label className="text-black" htmlFor="password1">Re-enter your password</Label>
            <Input
              id="password1"
              placeholder="••••••••"
              type="password"
              className="custom-radiusI"
              value={formData.password1}
              onChange={handleChange}
            />
            {errors.password1 && <p className="text-sm text-[#822538]">{errors.password1}</p>}
          </LabelInputContainer>

          {errorMessage && (
        <div className="bg-red-100 text-black p-2 rounded mt-2">
          {errorMessage}
        </div>
            )}

          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] custom-radiusI"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4 ">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#822538] shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
              type="submit"
              onClick={handleGoogleRegister}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-white">Sign up with Google</span>
              <BottomGradient />

            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-input bg-[#822538] shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
              type="submit"
              onClick={handleLinkedRegister}

            >
              <IconBrandLinkedin className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-white">Sign up with LinkedIn</span>
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
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-black to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-black to-transparent" />
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
