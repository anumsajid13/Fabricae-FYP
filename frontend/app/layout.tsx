import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// Import Tailwind CSS
import 'tailwindcss/tailwind.css';
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          {children} {/* This renders your application content */}
        </NextUIProvider>
      </body>
    </html>
  );
}