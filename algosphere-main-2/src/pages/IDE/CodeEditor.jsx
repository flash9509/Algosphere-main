import React from 'react';

/**
 * CodeEditor - Main code editing area with line numbers (Dark Theme)
 */
const CodeEditor = ({ code, onChange }) => {
    return (
        <div className="flex-1 relative overflow-hidden bg-neutral-900">
            {/* Line numbers gutter */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-neutral-900 border-r border-neutral-800 flex flex-col pt-4 text-right pr-3 select-none pointer-events-none overflow-hidden">
                {code.split('\n').map((_, i) => (
                    <div key={i} className="text-xs text-neutral-500 leading-6 font-mono">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Editor textarea */}
            <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full bg-neutral-900 text-white font-mono text-sm p-4 pl-16 outline-none resize-none leading-6 overflow-auto caret-white selection:bg-blue-500/30"
                spellCheck="false"
                placeholder="# Write your code here..."
                aria-label="Code editor"
                style={{
                    tabSize: 4,
                    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
                }}
            />
        </div>
    );
};

export default CodeEditor;

