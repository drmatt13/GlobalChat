import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocketChat",
  description: "A simple chat app using Next.js and Socket.io",
  openGraph: {
    title: "SocketChat",
    description: "A simple chat app using Next.js and Socket.io",
    type: "website",
    images: [{ url: "/opengraph-image.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta />
      </head>
      <body
        className={`${inter.className} ${
          cookieStore.get("darkMode") !== undefined &&
          cookieStore.get("darkMode")?.value === "true" &&
          "dark"
        }`}
      >
        {children}
      </body>
    </html>
  );
}
