import type { ReactNode } from 'react'
import './Layout.css'

interface Props {
  children: ReactNode
  onCreatePoint: () => void
  onGetPointsNearMe: () => void
}

export default function Layout({
  children,
  onCreatePoint,
  onGetPointsNearMe,
}: Props) {
  return (
    <div className="layout">
      <header className="header">
        <span className="header-icon">🗺️</span>
        <span className="header-title">Map View</span>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <div className="menu-title">Menu</div>
          <nav className="menu-nav">
            <button className="menu-item" onClick={onCreatePoint}>
              Create a Point
            </button>
            <button className="menu-item" onClick={onGetPointsNearMe}>
              Get points near me
            </button>
          </nav>
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
