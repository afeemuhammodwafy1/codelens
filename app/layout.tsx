import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WafyCodeLens",
  description: "Analyze public GitHub repositories for structure, quality, documentation, testing, and basic security signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
