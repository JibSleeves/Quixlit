import type {Metadata} from 'next';
import { Geist_Mono } from 'next/font/google'; // Changed from Geist to Geist_Mono
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const geistMono = Geist_Mono({ // Changed from geistSans to geistMono
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// geistMono is already defined above, so this one is redundant
// const geistMonoFont = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Nostalgia AI', // Updated app title
  description: 'A 90s OS-inspired AI application by Firebase Studio', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} font-mono antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
