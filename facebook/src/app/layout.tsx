import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facebook MLM App",
  description: "AI-powered social media marketing tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
