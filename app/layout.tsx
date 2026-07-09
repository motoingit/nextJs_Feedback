import type { Metadata } from 'next';
import './globals.css';

import AuthProvider from '../context/AuthProvider';

// configiration
export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};


// MAIN FUN
export default function RootLayout( {children} : {children:React.ReactNode}) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
