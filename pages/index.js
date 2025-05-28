import Site from '@/site.config'
import Calendar from '@/components/Calendar'
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

export default function Index({ data }) {
  return (
    <article data-url='/'>
      <section>
        <p>俊俊的</p>
        <p>紧急飞毯</p>
        <p>
          <img 
            src='/logo.gif'
            loading='lazy'
            onLoad={(e) => e.currentTarget.removeAttribute('loading')}
          />
        </p>
        <Calendar data={data} />
      </section>
    </article>
  );
}