import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SessionWrapper from "./components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Instagram clone",
  description: "a next.js app",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
      <body className={inter.className}>
        <Header/>
        {children}
      </body>
    </html>
    </SessionWrapper>
  );
}
