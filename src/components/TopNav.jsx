import React from 'react';

/**
 * TopNav – The persistent navigation bar.
 * Props:
 *   selectedLanguage: string
 *   onLanguageChange: (langId: string) => void
 *   languages: Array<{ id, label }>
 */
function TopNav({ selectedLanguage, onLanguageChange, languages, searchQuery, onSearchChange }) {
    return (
        <header className="top-nav">
            <div className="nav-left">
                <div className="logo">
                    <span className="logo-icon">{'</>'}</span>
                    <span className="logo-text">DevStack</span>
                </div>
                <nav className="nav-links">
                    <a href="#learn" className="nav-link active">Learn</a>
                </nav>
            </div>

            <div className="nav-center">
                <div className="search-box">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search lessons, concepts..."
                        id="global-search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <kbd>⌘ K</kbd>
                </div>
            </div>

            <div className="nav-right">
                <div className="lang-dropdown-wrapper">
                    <label htmlFor="lang-select" className="lang-label">Language:</label>
                    <div className="lang-select-container">
                        <select
                            id="lang-select"
                            value={selectedLanguage}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className="lang-select"
                            aria-label="Select programming language"
                        >
                            {languages.map((lang) => (
                                <option key={lang.id} value={lang.id}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                        <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
                <button className="btn btn-ghost" id="notif-btn" aria-label="Notifications">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="badge">3</span>
                </button>
            </div>
        </header>
    );
}

export default TopNav;
