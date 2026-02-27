import React, { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';

const MONACO_OPTIONS = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontLigatures: true,
    padding: { top: 16, bottom: 16 },
    scrollbar: { vertical: 'auto', horizontal: 'auto' },
    renderLineHighlight: 'line',
    wordWrap: 'on',
    tabSize: 2,
};

/**
 * CodeSandbox – The right-side pane with Monaco editor, Run button, and console.
 * Props:
 *   starterCode: string
 *   language: string (monaco language id)
 *   lessonId: string (used as key to reset editor on lesson change)
 */
function CodeSandbox({ starterCode, language, lessonId }) {
    const [code, setCode] = useState(starterCode);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    const outputRef = useRef(null);

    // Reset code when lesson changes
    React.useEffect(() => {
        setCode(starterCode);
        setOutput([]);
        setHasError(false);
    }, [lessonId, starterCode]);

    const scrollOutputToBottom = () => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    };

    const runCode = useCallback(() => {
        setIsRunning(true);
        setHasError(false);
        setIsConsoleOpen(true); // Open console when running code

        const logs = [];
        const timestamp = new Date().toLocaleTimeString();

        // Capture console.log in the sandbox
        const mockConsole = {
            log: (...args) =>
                logs.push({
                    type: 'log',
                    text: args
                        .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
                        .join(' '),
                }),
            warn: (...args) =>
                logs.push({ type: 'warn', text: args.map(String).join(' ') }),
            error: (...args) =>
                logs.push({ type: 'error', text: args.map(String).join(' ') }),
        };

        try {
            let executableCode = code;

            // Simple Hack: Convert Python comments (#) to JS comments (//) for execution in this simple sandbox
            if (language === 'python') {
                executableCode = executableCode.split('\n').map(line => {
                    return line.replace(/^(\s*)#/, '$1//').replace(/(\s+)#/, '$1//');
                }).join('\n');
            }

            // eslint-disable-next-line no-new-func
            const fn = new Function('console', 'print', executableCode);
            fn(mockConsole, mockConsole.log);

            if (logs.length === 0) {
                logs.push({ type: 'info', text: '(Code executed — no output)' });
            }
            setOutput([{ type: 'system', text: `▶ Ran at ${timestamp}` }, ...logs]);
            setHasError(false);
        } catch (err) {
            setOutput([
                { type: 'system', text: `▶ Ran at ${timestamp}` },
                { type: 'error', text: `${err.name}: ${err.message}` },
            ]);
            setHasError(true);
        }

        setIsRunning(false);
        setTimeout(scrollOutputToBottom, 50);
    }, [code, language]);

    const clearOutput = () => {
        setOutput([]);
        setHasError(false);
    };

    const resetCode = () => {
        setCode(starterCode);
        setOutput([]);
        setHasError(false);
    };

    return (
        <div className="sandbox-pane">
            {/* Editor Window */}
            <div className="editor-window">
                {/* Editor Header */}
                <div className="editor-header">
                    <div className="editor-tabs">
                        <button className="editor-tab active" id="editor-tab-main">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            main.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'css'}
                        </button>
                    </div>
                    <div className="editor-header-actions">
                        <button
                            className="editor-icon-btn"
                            onClick={resetCode}
                            title="Reset to starter code"
                            id="reset-code-btn"
                            aria-label="Reset code"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                            </svg>
                        </button>
                        <button
                            className={`btn btn-run ${isRunning ? 'running' : ''}`}
                            onClick={runCode}
                            disabled={isRunning}
                            id="run-code-btn"
                            aria-label="Run code"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="editor-body">
                    <Editor
                        key={lessonId}
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val ?? '')}
                        options={MONACO_OPTIONS}
                        loading={<div className="editor-loading">Loading editor…</div>}
                    />
                </div>
            </div>

            {/* Console Output */}
            <div className={`console-panel ${hasError ? 'has-error' : ''} ${!isConsoleOpen ? 'collapsed' : ''}`}>
                <div className="console-header" onClick={() => setIsConsoleOpen(!isConsoleOpen)} style={{ cursor: 'pointer' }}>
                    <div className="console-header-left">
                        <span className={`console-dot ${hasError ? 'error' : output.length ? 'active' : ''}`} />
                        <span className="console-title">Console Output</span>
                    </div>
                    <div className="console-header-right">
                        {isConsoleOpen && (
                            <button
                                className="console-clear-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearOutput();
                                }}
                                id="clear-console-btn"
                                aria-label="Clear console"
                            >
                                Clear
                            </button>
                        )}
                        <span className={`console-toggle-icon ${isConsoleOpen ? 'open' : ''}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </span>
                    </div>
                </div>
                {isConsoleOpen && (
                    <div className="console-output" ref={outputRef} aria-live="polite" aria-label="Console output">
                        {output.length === 0 ? (
                            <span className="console-placeholder">▶ Press "Run Code" to execute…</span>
                        ) : (
                            output.map((line, i) => (
                                <div key={i} className={`console-line console-${line.type}`}>
                                    {line.type === 'error' && <span className="console-line-icon">✕</span>}
                                    {line.type === 'warn' && <span className="console-line-icon">⚠</span>}
                                    {line.type === 'log' && <span className="console-line-icon">›</span>}
                                    <span className="console-line-text">{line.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CodeSandbox;
