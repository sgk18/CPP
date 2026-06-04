import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Open_Sans } from "next/font/google";
import { IntroProvider } from "@/components/layout/IntroProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Centre for Peace Praxis | Hope, Healing and Resilience",
    template: "%s | Centre for Peace Praxis"
  },
  description: "The Centre for Peace Praxis is a hub for peacebuilding, interfaith dialogue, and social transformation. Explore our activities, initiatives, and resources.",
  keywords: ["Peace Praxis", "Interfaith Dialogue", "Peacebuilding", "Social Transformation", "Activities", "Centre for Peace Praxis"],
  authors: [{ name: "Centre for Peace Praxis" }],
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${openSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fcfcfc] text-[#333]">
        <IntroProvider>
          {children}
        </IntroProvider>
      </body>
    </html>
  );
}
