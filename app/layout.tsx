import type { Metadata } from "next";
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
  title: "Student Saver",
  description: "Лучшие скидки, мероприятия и стажировки для студентов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="shortcut icon" href="favicon.ico" />
      </head>
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
        >
        {children}
      </body>
    </html>
  );
}
