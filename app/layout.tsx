import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Roboto, Roboto_Mono } from "next/font/google";
import { Comfortaa } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin", "cyrillic"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Student Saver | Самые выгодные акции и промокоды для студентов!",
  description: "Находи лучшие акции и промокоды для студентов в одном месте!",
  robots: "index, follow",
  keywords: [
    "студенты", "скидки", "промокоды", "акции", "мероприятия", "стажировки",
    "студенческие скидки", "студенческие промокоды", "студенческие акции",
    "студенческие мероприятия", "студенческие стажировки", "студенческие предложения",
    "студенческие скидки 2025", "студенческие промокоды 2025", "студенческие акции 2025",
    "студенческие мероприятия 2025", "студенческие стажировки 2025", "студенческие предложения 2025"
  ],
  authors: [{ name: "Student Saver", url: "https://studsaver.vercel.app" }],
  metadataBase: new URL("https://studsaver.vercel.app"),
  openGraph: {
    title: "Student Saver | Самые выгодные акции и промокоды для студентов!",
    description: "Находи лучшие акции и промокоды для студентов в одном месте!",
    url: "https://studsaver.vercel.app",
    siteName: "Student Saver",
    images: [
      {
        url: "https://studsaver.vercel.app/favicon.png",
        width: 1200,
        height: 630,
        alt: "Student Saver – акции и промокоды для студентов!",
      },
    ],
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Saver | Самые выгодные акции и промокоды для студентов!",
    description: "Находи лучшие акции и промокоды для студентов в одном месте!",
    images: ["https://studsaver.vercel.app/favicon.png"],
    creator: "@studentsaver",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>
          Student Saver | Самые выгодные акции и промокоды для студентов!
        </title>
        <meta
          name="description"
          content="Находи лучшие акции и промокоды для студентов в одном месте!"
        />
        
        <meta
          name="keywords"
          content="студенты, скидки, промокоды, акции, мероприятия, стажировки, студенческие скидки, студенческие промокоды, студенческие акции, студенческие мероприятия, студенческие стажировки, студенческие предложения, студенческие скидки 2025, студенческие промокоды 2025, студенческие акции 2025, студенческие мероприятия 2025, студенческие стажировки 2025, студенческие предложения 2025"
        />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://studsaver.vercel.app" />
        <meta
          property="og:title"
          content="Student Saver | Самые выгодные акции и промокоды для студентов!"
        />
        <meta 
          property="og:description"
          content="Находи лучшие акции и промокоды для студентов в одном месте!"
        />
        <meta property="og:image" content="/favicon.png" />

        <meta name="author" content="Student Saver" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://studsaver.vercel.app" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <meta property="og:site_name" content="Student Saver" />
        <meta property="og:locale" content="ru_RU" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@studsaver" />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Student Saver",
              "description": "Находи лучшие акции и промокоды для студентов в одном месте!",
              "url": "https://studsaver.vercel.app",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Any",
              "inLanguage": "ru-RU"
            }
          `}
        </script>
      </head>
      <body className={`${roboto.variable} ${robotoMono.variable} ${comfortaa.variable} antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}