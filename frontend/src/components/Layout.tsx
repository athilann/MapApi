import type { ReactNode } from 'react'
import './Layout.css'

interface Props {
  children: ReactNode
  onSearch: () => void
  onCreatePoint: () => void
}

export default function Layout({ children, onSearch, onCreatePoint }: Props) {
  return (
    <div className="layout">
      <header className="header">
        <span className="header-title">MAP VIEW</span>
      </header>
      <div className="map-area">
        <div className="overlay-controls">
          <button className="overlay-btn search-btn" onClick={onSearch}>
            SEARCH
          </button>
          <button className="overlay-btn create-btn" onClick={onCreatePoint}>
            +
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
