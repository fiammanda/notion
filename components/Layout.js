import { useRouter } from 'next/router'
import Head from 'next/head';
import Site from '@/site.config';
import SmoothLink from '@/components/SmoothLink';

export default function Layout({ title, description, data, children }) {
  const router = useRouter()
  const current = router.asPath

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
        <title>{title ? `${Site.title} - ${title}` : Site.title}</title>
        <meta name="author" content={Site.author} />
        <meta name="description" content={description || Site.description} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://rsms.me/" crossOrigin="anonymous" />
      </Head>

      <div className="site">
        <header>
          <div className="placeholder" onClick={() => document.body.classList.remove('side')}></div>
          <section>
            <h1>
              <SmoothLink rel="home" href="/" className={current === '/' ? 'current' : undefined}>
                <span>Emergency</span><span>Flying</span><span>Carpet</span>
              </SmoothLink>
            </h1>
            <ul>
              <li>
                <SmoothLink href="/log/" data-type="log" className={current === '/log/' ? 'current' : undefined}>
                  <span data-name="记了" className="font-num">{data.list.length}</span>
                </SmoothLink>
              </li>
              {Object.entries(Site.type).map(([type, slug]) => (
                  data.type[type] && (<li key={slug}>
                  <SmoothLink href={`/${slug}/`} data-type={slug} className={current === `/${slug}/` ? 'current' : undefined}>
                    <span data-name={type} className="font-num">{data.type[type].length || 0}</span>
                  </SmoothLink>
                </li>)
              ))}
            </ul>
            <p>
              <a role="switch" className="theme"></a>
            </p>
          </section>
          <a role="button" className="menu" onClick={() => document.body.classList.add('side')}></a>
        </header>
        <main>{children}</main>
      </div>
    </>
  );
}
