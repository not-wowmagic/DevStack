import React, { useState, useMemo } from 'react';
import TopNav from './components/TopNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import LessonPanel from './components/LessonPanel.jsx';
import CodeSandbox from './components/CodeSandbox.jsx';
import { languages, curriculum } from './data/curriculum.js';

function App() {
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [activeLessonId, setActiveLessonId] = useState('intro');
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    const lessons = useMemo(
        () => curriculum[selectedLanguage]?.lessons ?? [],
        [selectedLanguage]
    );

    const filteredLessons = useMemo(() => {
        if (!searchQuery) return lessons;
        return lessons.filter(l =>
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.content.heading.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [lessons, searchQuery]);

    const activeLessonIndex = useMemo(
        () => lessons.findIndex((l) => l.id === activeLessonId),
        [lessons, activeLessonId]
    );

    const activeLesson = lessons[activeLessonIndex] ?? null;

    const selectedLangMeta = languages.find((l) => l.id === selectedLanguage);

    const handleLanguageChange = (langId) => {
        setSelectedLanguage(langId);
        const firstLesson = curriculum[langId]?.lessons?.[0];
        setActiveLessonId(firstLesson?.id ?? 'intro');
        setCompletedLessons(new Set());
        setSearchQuery('');
    };

    const handleSelectLesson = (id) => {
        setActiveLessonId(id);
    };

    const handleNext = () => {
        if (activeLessonIndex < lessons.length - 1) {
            setCompletedLessons((prev) => new Set(prev).add(activeLessonId));
            setActiveLessonId(lessons[activeLessonIndex + 1].id);
        }
    };

    const handlePrev = () => {
        if (activeLessonIndex > 0) {
            setActiveLessonId(lessons[activeLessonIndex - 1].id);
        }
    };

    return (
        <div className="app-root">
            <TopNav
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                languages={languages}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className="app-body">
                <Sidebar
                    lessons={filteredLessons}
                    activeLesson={activeLessonId}
                    onSelectLesson={handleSelectLesson}
                    language={selectedLanguage}
                    completedLessons={completedLessons}
                />

                <main className="main-view" role="main">
                    <LessonPanel
                        lesson={activeLesson}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        hasNext={activeLessonIndex < lessons.length - 1}
                        hasPrev={activeLessonIndex > 0}
                    />

                    <CodeSandbox
                        key={`${selectedLanguage}-${activeLessonId}`}
                        starterCode={activeLesson?.content?.starterCode ?? '// Start coding here\n'}
                        language={selectedLangMeta?.monacoLang ?? 'javascript'}
                        lessonId={`${selectedLanguage}-${activeLessonId}`}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
