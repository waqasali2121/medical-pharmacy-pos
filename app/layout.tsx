import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Store POS",
  description: "Pharmacy POS and inventory management system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
