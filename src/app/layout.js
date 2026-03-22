import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Good Samaritan Institute | IT Consulting',
  description:
    'Trusted IT and technology consulting services. Strategic guidance, digital transformation, cloud solutions, and cybersecurity expertise.',
  keywords:
    'IT consulting, technology consulting, digital transformation, cloud solutions, cybersecurity',
  author: 'Good Samaritan Institute',
  openGraph: {
    title: 'Good Samaritan Institute | IT Consulting',
    description:
      'Trusted IT and technology consulting services. Strategic guidance, digital transformation, cloud solutions, and cybersecurity expertise.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
