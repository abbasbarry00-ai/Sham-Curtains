import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "معرض ستائر شام | تصميم ستائرك بالذكاء الاصطناعي",
  description: "ارفع صورة نافذتك وحدد نوع ولون القماش وسيتولى الذكاء الاصطناعي تصميم ستارة واقعية متناسقة مع غرفتك خلال ثوانٍ معدودة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
