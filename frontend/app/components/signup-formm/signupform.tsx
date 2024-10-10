"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandLinkedin
} from "@tabler/icons-react";
import '../../globals.css';

export function SignupFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
  <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black mt-60 custom-radiusF">
      <h2 className="font-bold text-xl text-neutral-200">
        Welcome to Fabricae
      </h2>
      <p className=" text-sm max-w-sm mt-2 text-neutral-300">
        Login to Fabricae if you already have an account!
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 ">
          <LabelInputContainer >
            <Label  htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" className="custom-radiusI"/>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" className="custom-radiusI"  />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="haniya911@gmail.com" type="email" className="custom-radiusI"/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" className="custom-radiusI" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password1">Re-enter your password</Label>
          <Input
            id="password1"
            placeholder="••••••••"
            type="password1"
            className="custom-radiusI"
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn  from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] custom-radiusI"
          type="submit"

        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

              <div className="flex flex-col space-y-4 ">
        <button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
          type="submit"
        >
          <IconBrandGithub className="h-4 w-4 text-neutral-300" />
          <span className="text-neutral-300 text-sm">
            GitHub
          </span>
          <BottomGradient />
        </button>

        <button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
          type="submit"
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
          <span className="text-neutral-300 text-sm">
            Google
          </span>
          <BottomGradient />
        </button>

        <button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)] custom-radiusI"
          type="submit"
        >
         <IconBrandLinkedin className="h-4 w-4 text-neutral-300" />
    <span className="text-neutral-300 text-sm">LinkedIn</span>
    <BottomGradient />
        </button>
      </div>

      </form>
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
