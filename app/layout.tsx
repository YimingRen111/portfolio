import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransitionProvider from '@/components/TransitionProvider';
import ContentAnimator from '@/components/ContentAnimator';

export const metadata: Metadata = {
  title: 'Yiming Ren • Portfolio',
  description: 'Software Engineer • Frontend • Backend • ML',
  metadataBase: new URL('https://example.com'),
  openGraph: { title: 'Yiming Ren • Portfolio', description: 'Software Engineer • Frontend • Backend • ML', images: ['/og.jpg'] },
  icons: {
    icon: '/avatar_ss.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen flex flex-col">
        <TransitionProvider>
          <Header />
          <ContentAnimator>
            <main className="flex-1">{children}</main>
          </ContentAnimator>
          <Footer />
        </TransitionProvider>
      </body>
    </html>
  );
}
