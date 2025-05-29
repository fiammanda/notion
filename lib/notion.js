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
  const res = await fetch(`https://notion-api.splitbee.io/v1/page/${id}?t=${Date.now()}`)
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

export function renderText(title) {
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

export function renderHTML(raw) {
  const blocks = raw[Object.keys(raw).filter(key => raw[key].value.type === 'page')].value.content
  let html = ""
  let list = []
  let listType = null
  const renderList = () => {
    if (list.length === 0) return
    const tag = listType === 'numbered_list' ? 'ol' : 'ul'
    html += `<${tag}>` + list.map(item => `<li${item.task}>${item.text}</li>`).join('') + `</${tag}>`
    list = []
    listType = null
  }
  blocks && blocks.forEach(block => {
    if (!raw[block].value?.properties) return
    const type = raw[block].value.type
    const text = renderText(raw[block].value.properties.title || []).replace(/::([a-z_]+)::/g, `<span data-icon="$1"></span>`)
    if (type === 'bulleted_list' || type === 'numbered_list' || type === 'to_do') {
      if (listType && listType !== type) renderList()
      listType = type
      list.push({
        text,
        task: type === 'to_do' 
          ? ` class="task${raw[block].value.properties.checked?.[0][0] === 'Yes' ? ' task-checked' : ''}"`
          : ''
      })
    } else {
      renderList()
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
        case 'bulleted_list':
          html += `<li>${text}</li>`
          break
        case 'numbered_list':
          html += `<li>${text}</li>`
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
          html += ``
      }
    }
  })
  renderList()
  return html
}
