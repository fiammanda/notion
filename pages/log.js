import Site from '@/site.config'
import SmoothLink from '@/components/SmoothLink';
import { getData, renderDate } from '@/lib/notion'

export async function getStaticProps() {
  const data = await getData()
  return {
    props: {
      title: 'LOG',
      data
    },
    revalidate: Site.revalidate
  };
}

export default function Log({ data }) {
  return (
    <article>
      <h2>记了 <span data-type='log'></span></h2>
      <ul className='journal-list'>
        {data.list.map(date => (
          <li key={date}>
            <SmoothLink href={`/log/${date}/`}>
              <span className='font-num'>{renderDate(date)}</span>
            </SmoothLink>
            {[...new Set(data.date[date].map(index => data.raw[index].Type))].map(type => (
              <SmoothLink href={`/${Site.type[type]}/`} data-type={Site.type[type]} key={`${type}`}></SmoothLink>
            ))}
          </li>
        ))}
      </ul>
    </article>
  )
}