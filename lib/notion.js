import Site from '@/site.config';

export async function getData() {
  const res = await fetch(`https://notion-api.splitbee.io/v1/table/${process.env['DATABASE']}`)
  const raw = await res.json()
  const data = {
    raw,
    list: [],
    date: {},
    type: {},
  }
  const order = Object.keys(Site.type).reduce((acc, type, index) => {
    acc[type] = index
    return acc
  }, {})
  raw.sort((x, y) => {
    const dateX = x.Date ? new Date(x.Date) : new Date(0)
    const dateY = y.Date ? new Date(y.Date) : new Date(0)
    const dateZ = dateY - dateX
    if (dateZ !== 0) return dateZ
    const typeX = x.Type ?? ''
    const typeY = y.Type ?? ''
    return (order[typeX] ?? Infinity) - (order[typeY] ?? Infinity)
  })
  for (const item of raw) {
    const date = item.Date.replace(/-/g, '') || null
    const type = item.Type || null
    if (date) {
      (data.date[date] ??= []).push(raw.indexOf(item))
    }
    if (type) {
      (data.type[type] ??= []).push(raw.indexOf(item))
    }
  }
  data.list = Object.keys(data.date).reverse()
  return data
}

export async function getPage(id) {
  const res = await fetch(`https://notion-api.splitbee.io/v1/page/${id}`)
  const raw = await res.json()
  return raw
}

export function renderMeta(page) {
  let meta = ''
  if (page.Rate) {
    meta += Site.rate[page.Rate]
  }
  if (page.Tags) {
    meta += `<span data-icon="info"></span>` + page.Tags.map(tag => `<span class="journal-tag">${tag}</span>`).join(' ')
  }
  if (page.Info && page.Type === '读了') {
    meta += `<span data-icon="info">${page.Info}</span>`
  }
  return meta
}

export function renderDate(date) {
  return date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3')
}

export function renderHTML(raw) {
  const blocks = raw[Object.keys(raw).filter(key => raw[key].value.type === 'page')].value?.content || []

  function renderTitle(title) {
    return title
      .map(([t, d]) => {
        if (!d) return t
        return d.reduce((text, deco) => {
          const [type, info] = deco
          switch (type) {
            case 'a':
              return `<a href="${info}" target="_blank" rel="noopener noreferrer">${text}</a>`
            case 'b':
              return `<strong>${text}</strong>`
            case 'c':
              return `<code>${text}</code>`
            case 'i':
              return `<em>${text}</em>`
            case 's':
              return `<del>${text}</del>`
            default:
              return text
          }
        }, t)
      })
      .join('')
  }

  function renderBlock(blocks, depth = 0) {
    let html = ''
    let listItem = []
    let listType = null
    let listNested = false

    const renderList = () => {
      if (listItem.length === 0) return ''
      const tag = listType === 'numbered_list' ? 'ol' : 'ul'
      const ctt = listItem.join('')
      const cls = listNested ? ' class="nested"' : ''
      listItem = []
      return `<${tag}${cls}>${ctt}</${tag}>`
    }

    for (const id of blocks) {
      const block = raw[id]?.value
      if (!block?.properties) continue

      const type = block.type
      const text = renderTitle(block.properties.title || []).replace(/::([a-z_]+)::/g, `<span data-icon="$1"></span>`)
      const children = block.content || []

      const renderChildren = () => children.length > 0 ? renderBlock(children, depth + 1) : ''

      if (['bulleted_list', 'numbered_list', 'to_do'].includes(type)) {
        if (listType !== type && listItem.length > 0) {
          html += renderList()
        }
        listType = type

        let task = ''
        if (type === 'to_do') {
          const checked = block.properties.checked?.[0][0] === 'Yes'
            task = ` class="task${checked ? ' task-checked' : ''}"`
        }

        if (renderChildren) listNested = true
        listItem.push(`<li${task}>${text}${renderChildren()}</li>`)
      } else {
        if (listItem.length > 0) {
          html += renderList()
        }

        switch (type) {
          case 'text':
            html += `<p>${text}</p>`
            break
          case 'header':
            html += `<h4>${text}</h4>`
            break
          case 'sub_header':
            html += `<h5>${text}</h5>`
            break
          case 'sub_sub_header':
            html += `<h6>${text}</h6>`
            break
          case 'quote':
            html += `<blockquote>${text}</blockquote>`
            break
          case 'code':
            html += `<pre><code>${text}</code></pre>`
            break
          case 'callout':
            html += `<div class="callout">${text}</div>`
            break
          case 'divider':
            html += `<hr />`
            break
          default:
            break
        }

        if (children.length > 0) {
          html += renderChildren()
        }
      }
    }

    html += renderList()
    return html
  }

  return renderBlock(blocks)
}
