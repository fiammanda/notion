import Site from '@/site.config';
import SmoothLink from '@/components/SmoothLink';
import { getData, getPage, renderMeta, renderDate, renderHTML } from '@/lib/notion'

export async function getStaticPaths() {
  const data = await getData()
  return {
    paths: data.list.map((date) => ({ params: { date } })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const data = await getData()
  const date = params.date
  if (!data.list.includes(date)) {
    return { notFound: true }
  }
  const pages = await Promise.all(
    data.date[date].map(async (index) => {
      const item = data.raw[index]
      const page = await getPage(item.id)
      return {
        HTML: renderHTML(page),
        ...item
      }
    })
  )
  return {
    props: {
      data,
      pages,
      title: renderDate(date)
    },
    revalidate: Site.revalidate,
  }
}

export default function LogDate({ data, pages, title }) {
  const i = data.list.indexOf(title.replace(/\//g, ''))
  const nav = [data.list[i + 1] || null, data.list[i - 1] || null]
  return (
    <>
      <article>
        <h2>{title}</h2>
        {pages.map((page) => (
          <section key={page.id}>
            <h3>
              {page.Name}
              <SmoothLink href={`/${Site.type[page.Type]}/`} data-type={Site.type[page.Type]}></SmoothLink>
            </h3>
            {(page.Tags || page.Rate) && (<div className="journal-meta" dangerouslySetInnerHTML={{ __html: renderMeta(page) }} />)}
            {(page.Summary) && (<div dangerouslySetInnerHTML={{ __html: page.Summary }} />)}
            <div dangerouslySetInnerHTML={{ __html: page.HTML }} />
          </section>
        ))}
      </article>
      <nav>
        {nav[0] ? (<SmoothLink rel="prev" href={`/log/${nav[0]}`}>{renderDate(nav[0])}</SmoothLink>) : (<a></a>)}
        {nav[1] ? (<SmoothLink rel="next" href={`/log/${nav[1]}`}>{renderDate(nav[1])}</SmoothLink>) : (<a></a>)}
      </nav>
    </>
  )
}
