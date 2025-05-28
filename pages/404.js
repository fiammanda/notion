import Site from '@/site.config'
import { getData } from '@/lib/notion'

export async function getStaticProps() {
  const data = await getData()
  return {
    props: {
      data,
    },
    revalidate: Site.revalidate
  }
}

export default function Custom404() {
  return (
    <article data-url='/'>
      <section>
        <p>紧急飞毯</p>
        <p>404</p>
        <p>
          <img 
            src='/logo.gif'
            loading='lazy'
            onLoad={ (e) => e.currentTarget.removeAttribute('loading') }
          />
        </p>
      </section>
    </article>
  )
}