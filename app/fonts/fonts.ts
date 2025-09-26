import { Inter, Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';

// Define your local font
const postNordSans = localFont({
  src: [
    {
      path: './postnordsansregular.otf',
      weight: '400',
      style: 'normal',
    },
    // Add other weights/styles if available
    // {
    //   path: './postnordsans-medium.otf',
    //   weight: '500',
    //   style: 'normal',
    // },
  ],
  variable: '--font-sans',
  display: 'swap',
});

// Export the class name to be used in your components
export const fontSans = postNordSans.className;
