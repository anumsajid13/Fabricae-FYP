"use client";

import { motion } from "framer-motion";
import { SignupFormDemo } from "../components/signup-formm/signupform";
import { AuroraBackground } from "../components/ui/aurora-background";

export default function Signup() {
  return (
    //<SignupFormDemo />
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 min-w-full"
      >
        <SignupFormDemo />
      </motion.div>
    </AuroraBackground>
  );
}
