import React from 'react';

/**
 * Sidebar – Vertical lesson navigation menu.
 * Props:
 *   lessons: Array<{ id, title, icon }>
 *   activeLesson: string (lesson id)
 *   onSelectLesson: (id: string) => void
 *   language: string
 *   completedLessons: Set<string>
 */
function Sidebar({ lessons, activeLesson, onSelectLesson, language, completedLessons }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <p className="sidebar-course-label">Course Map</p>
                <h2 className="sidebar-course-title">
                    {language.charAt(0).toUpperCase() + language.slice(1)} 101
                </h2>
                <div className="sidebar-progress">
                    <div
                        className="sidebar-progress-fill"
                        style={{
                            width: `${lessons.length ? (completedLessons.size / lessons.length) * 100 : 0}%`,
                        }}
                    />
                </div>
                <p className="sidebar-progress-label">
                    {completedLessons.size} / {lessons.length} complete
                </p>
            </div>

            <nav className="sidebar-nav" aria-label="Lesson navigation">
                {lessons.map((lesson) => {
                    const isActive = lesson.id === activeLesson;
                    const isDone = completedLessons.has(lesson.id) && !isActive;
                    return (
                        <button
                            key={lesson.id}
                            id={`lesson-btn-${lesson.id}`}
                            className={`sidebar-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                            onClick={() => onSelectLesson(lesson.id)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className="sidebar-item-icon">
                                {isDone ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    lesson.icon
                                )}
                            </span>
                            <span className="sidebar-item-title">{lesson.title}</span>
                            {isActive && <span className="sidebar-item-dot" />}
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="btn-sidebar-action" id="view-docs-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    View Documentation
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
