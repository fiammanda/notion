import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { Noto_Sans_SC } from 'next/font/google';
import '@/styles/global.css';
import Layout from '@/components/Layout';

const notoSansSC = Noto_Sans_SC({
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  fallback: ['system-ui'],
  preload: false,
  adjustFontFallback: false,
  variable: '--font-noto',
});

export default function Site({ Component, pageProps }) {
  const router = useRouter();
  const { title = '', description = '', data = { raw: [], date: {}, type: {}, list: [] } } = pageProps

  useEffect(() => {
    document.body.removeAttribute('aria-hidden');
    const handleComplete = () => {
      document.querySelector('main').removeAttribute('aria-hidden');
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);
  
  return (
    <Layout title={title} description={description} data={data}>
      <Component {...pageProps} />
    </Layout>
  );
}