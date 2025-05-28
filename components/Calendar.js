import { useState } from 'react'
import SmoothLink from '@/components/SmoothLink'

export default function Calendar({ data }) {
  const first = data.list.slice(-1)[0]
  const start = new Date(first.slice(0, 4), first.slice(4, 6) - 1, first.slice(6, 8))
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const disable = [
    new Date(current.getFullYear(), current.getMonth() - 1, 1) < new Date(start.getFullYear(), start.getMonth(), 1), 
    new Date(current.getFullYear(), current.getMonth() + 1, 1) > new Date(today.getFullYear(), today.getMonth(), 1)
  ]

  const calNav = (offset) => {
    const d = new Date(current.getFullYear(), current.getMonth() + offset, 1)
      setCurrent(d)
  }

  const calBuild = () => {
    const year  = current.getFullYear()
    const month = current.getMonth()
    const days  = new Date(year, month + 1, 0).getDate()
    const day0  = new Date(year, month, 1).getDay()
    const day1  = new Date()
    const grid  = []
    for (let i = 0; i < day0; i++) {
      grid.push(<a key={i - day0} />)
    }
    for (let i = 1; i <= days; i++) {
      const date = `${year}${String(month + 1).padStart(2, '0')}${String(i).padStart(2, '0')}`
      const test = [
        data.date[date],
        day1.toDateString() === new Date(year, month, i).toDateString()
      ]
      grid.push(
        test[0] ? (
          <SmoothLink href={`/log/${date}/`} className={`calendar-day${test[1] ? ' calendar-today' : ''}`} key={date}>
            {String(i).padStart(2, '0')}
          </SmoothLink>
        ) : (
          <a key={date} className={`calendar-day${test[1] ? ' calendar-today' : ''}`}>{String(i).padStart(2, '0')}</a>
        )
      )
    }
    return grid
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <span className="calendar-title">{current.getFullYear()} {String(current.getMonth() + 1).padStart(2, '0')}</span>
        <a className="calendar-prev" onClick={() => calNav(-1)} aria-disabled={disable[0]}></a>
        <a className="calendar-next" onClick={() => calNav(+1)} aria-disabled={disable[1]}></a>
      </div>
      <div className="calendar-body">
        <span className="calendar-week">Sun</span>
        <span className="calendar-week">Mon</span>
        <span className="calendar-week">Tue</span>
        <span className="calendar-week">Wed</span>
        <span className="calendar-week">Thu</span>
        <span className="calendar-week">Fri</span>
        <span className="calendar-week">Sat</span>
        {calBuild()}
      </div>
    </div>
  );
};
