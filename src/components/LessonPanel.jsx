import React from 'react';
import SyntaxTable from './SyntaxTable.jsx';

/**
 * LessonPanel – Reusable lesson content display component.
 * Props:
 *   lesson: object (the full lesson content)
 *   onNext: () => void
 *   onPrev: () => void
 *   hasNext: boolean
 *   hasPrev: boolean
 */
function LessonPanel({ lesson, onNext, onPrev, hasNext, hasPrev }) {
    if (!lesson) return null;
    const { content } = lesson;

    return (
        <section className="lesson-panel" aria-label="Lesson content">
            <div className="lesson-panel-inner">

                {/* Breadcrumb */}
                <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
                    <span>Course</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>{lesson.title}</span>
                </nav>

                {/* Heading */}
                <h1 className="lesson-heading">{content.heading}</h1>

                {/* Intro Paragraph */}
                <p className="lesson-intro">{content.intro}</p>

                {/* Concept Callout */}
                <div className="lesson-callout concept" role="note">
                    <span className="callout-label">CONCEPT</span>
                    <p>{content.concept}</p>
                </div>

                {/* Task */}
                <h3 className="lesson-section-title">Your Task</h3>
                <p className="lesson-task">{content.task}</p>

                {/* Checklist */}
                <ul className="task-checklist">
                    {content.steps.map((step, i) => (
                        <li key={i} className="task-checklist-item">
                            <span className="task-check" aria-hidden="true" />
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>

                {/* Example Code Block */}
                <h3 className="lesson-section-title">Example</h3>
                <div className="code-example-block">
                    <div className="code-example-header">
                        <span className="code-file-label">example</span>
                    </div>
                    <pre className="code-example-pre">
                        <code>{content.example}</code>
                    </pre>
                </div>

                {/* Syntax Reference Table */}
                {content.syntaxTable && content.syntaxTable.length > 0 && (
                    <>
                        <h3 className="lesson-section-title">Syntax Reference</h3>
                        <SyntaxTable rows={content.syntaxTable} />
                    </>
                )}

                {/* Navigation Footer */}
                <div className="lesson-footer">
                    <button
                        className="btn btn-ghost"
                        onClick={onPrev}
                        disabled={!hasPrev}
                        id="prev-lesson-btn"
                        aria-label="Previous lesson"
                    >
                        ← Previous
                    </button>
                    <button
                        className={`btn ${hasNext ? 'btn-primary' : 'btn-success'}`}
                        onClick={onNext}
                        disabled={!hasNext}
                        id="next-lesson-btn"
                        aria-label="Next lesson"
                    >
                        {hasNext ? 'Next Lesson →' : '🎉 Course Complete!'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default LessonPanel;
