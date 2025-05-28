import Site from '@/site.config'
import SmoothLink from '@/components/SmoothLink';
import { getData, renderMeta } from '@/lib/notion'

export async function getStaticPaths() {
  const data = await getData()
  return {
    paths: Object.keys(data.type).map(type => ({
      params: { type: Site.type[type] }
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const data = await getData()
  const type = Object.keys(Site.type).find(key => Site.type[key] === params.type)
  return {
    props: {
      title: `#${params.type.charAt(0).toUpperCase() + params.type.slice(1)}`,
      type,
      data
    },
    revalidate: Site.revalidate
  }
}

export default function LogType({ type, data }) {
  const slug = Site.type[type]
  const items = data.type[type].map(index => data.raw[index])
  if (['novel', 'book', 'show', 'game'].includes(slug)) {
    return (
      <article data-url="cover">
        <h2>{type} <span data-type={slug}></span></h2>
        <ul className='journal-list'>
          {items.map(item => (
            <li key={item.id}>
              <figure>
                <img
                  src={item.Cover[0].url}
                  loading='lazy'
                  onLoad={(e) => e.currentTarget.removeAttribute('loading')}
                />
              </figure>
              <figcaption>
                <SmoothLink href={`/log/${item.Date.replace(/-/g, '')}/`}>{item.Name}</SmoothLink>
                <p className="journal-meta" dangerouslySetInnerHTML={{ __html: renderMeta(item) }} />
                <p className="journal-summary">{item.Summary}</p>
              </figcaption>
            </li>
          ))}
        </ul>
      </article>
    )
  }
  return (
    <article>
      <h2>{type} <span data-type={slug}></span></h2>
      <ul className='journal-list'>
        {items.map(item => (
          <li key={item.id}>
            <SmoothLink href={`/log/${item.Date.replace(/-/g, '')}/`}>
              <span className='font-num'>{item.Date.replace(/-/g, '/')}</span>
              <span className='journal-title'>{item.Name}</span>
            </SmoothLink>
          </li>
        ))}
      </ul>
    </article>
  )
}
