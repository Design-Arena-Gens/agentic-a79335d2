import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avatar Prompt Studio",
  description: "Upload an avatar and craft tailored Kling 2.6 video prompts."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
