import { Html, Head, Main, NextScript } from 'next/document';
import Site from '@/site.config';

export default function Document() {
  return (
    <Html lang={Site.lang}>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght,FILL@400,0..1&display=block" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" crossOrigin="anonymous" />
        <script src="/assets/script.js" defer></script>
      </Head>
      <body aria-hidden="true">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}