import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
// import "./styles/custom.css"; // Ensure this path is correct if custom.css is needed globally

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Centre for Peace Praxis | Hope, Healing and Resilience",
  description:
    "The Centre for Peace Praxis is a hub for peacebuilding, interfaith dialogue, and social transformation. Explore our workshops, initiatives, and resources.",
  keywords:
    "Peace Praxis, Interfaith Dialogue, Peacebuilding, Social Transformation, Workshops, Centre for Peace Praxis",
  authors: [{ name: "Centre for Peace Praxis" }],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${montserrat.variable} ${openSans.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
