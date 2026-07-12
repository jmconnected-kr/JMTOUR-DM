import type { Metadata } from 'next';
import { DemoContentProvider } from '../components/travel-demo/content-store';
import './globals.css';

export const metadata: Metadata = {
  title: 'Travel Companion Demo',
  description: 'Hockney-inspired travel companion demo web app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <DemoContentProvider>{children}</DemoContentProvider>
      </body>
    </html>
  );
}
