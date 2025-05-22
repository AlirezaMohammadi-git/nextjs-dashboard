
import '@/app/ui/global.css'
import { inter } from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // what is antialiased?
  // https://tailwindcss.com/docs/font-smoothing
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}


//fixme: start from here: https://nextjs.org/learn/dashboard-app/navigating-between-pages
