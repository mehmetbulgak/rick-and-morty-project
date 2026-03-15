import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/shared/components/site-footer/site-footer";
import { SiteHeader } from "@/shared/components/site-header/site-header";

export const metadata: Metadata = {
  title: "Rick and Morty Explorer",
  description: "Responsive character explorer built for the Vanora case study.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
