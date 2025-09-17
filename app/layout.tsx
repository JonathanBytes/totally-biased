import type { Metadata } from "next";
import { ibm, inter, yeseva } from "./fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { shadcn } from "@clerk/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Totally biased",
  description:
    "A subjective sort app to rank by taste, bias, and gut instinct.",
  appleWebApp: {
    title: "Totally biased",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: shadcn }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${ibm.variable} ${yeseva.variable} font-sans antialiased`}
        >
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-dvh">
                <Toaster richColors position="top-right" />
                <header className="flex items-center justify-center w-full">
                  <NavBar />
                </header>
                <main className="flex flex-1 flex-col items-center gap-8 px-4">
                  {children}
                </main>
                {/* Grid pattern background */}
                <div className="w-full h-full grid-background z-[-10] fixed top-0 left-0 pointer-events-none area-hidden" />
              </div>
              <Footer />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
