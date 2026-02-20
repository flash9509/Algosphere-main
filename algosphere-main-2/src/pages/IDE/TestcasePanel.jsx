import React, { useState } from 'react';

/**
 * TestcasePanel - Displays test cases and results
 */
const TestcasePanel = ({
    testcases,
    activeTestcase,
    onTestcaseChange,
    activeTab,
    onTabChange,
    testResults
}) => {
    return (
        <div className="flex flex-col h-full bg-neutral-900">
            {/* Testcase/Test Result Tabs */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-neutral-700">
                <button
                    className={`text-sm font-medium pb-1 ${activeTab === 'testcase' ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                    onClick={() => onTabChange?.('testcase')}
                >
                    Testcase
                </button>
                <button
                    className={`text-sm font-medium pb-1 ${activeTab === 'result' ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                    onClick={() => onTabChange?.('result')}
                >
                    Test Result
                </button>
            </div>

            {/* Testcase Selector */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-700">
                {testcases && testcases.map((tc, index) => (
                    <button
                        key={index}
                        onClick={() => onTestcaseChange(index)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${activeTestcase === index
                            ? 'bg-neutral-700 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                            }`}
                    >
                        Case {index + 1}
                    </button>
                ))}
            </div>

            {/* Testcase Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {activeTab === 'testcase' ? (
                    testcases && testcases[activeTestcase] ? (
                        <>
                            <div>
                                <div className="text-xs font-medium text-neutral-400 mb-1.5">Input</div>
                                <div className="bg-neutral-800 rounded-lg p-3 font-mono text-sm text-white border border-neutral-700 whitespace-pre-wrap">
                                    {testcases[activeTestcase].input || '(empty)'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-neutral-400 mb-1.5">Expected Output</div>
                                <div className="bg-neutral-800 rounded-lg p-3 font-mono text-sm text-white border border-neutral-700 whitespace-pre-wrap">
                                    {testcases[activeTestcase].expected_output || '(empty)'}
                                </div>
                            </div>
                            {testcases[activeTestcase].explanation && (
                                <div>
                                    <div className="text-xs font-medium text-neutral-400 mb-1.5">Explanation</div>
                                    <div className="bg-neutral-900 rounded-lg p-3 text-sm text-neutral-300 border border-neutral-800 whitespace-pre-wrap">
                                        {testcases[activeTestcase].explanation}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-neutral-500 text-sm text-center py-8">
                            <div className="text-neutral-400 mb-2">📋 No test cases available</div>
                            <div className="text-xs">This problem doesn't have example test cases yet.</div>
                        </div>
                    )
                ) : (
                    <div className="space-y-3">
                        {testResults && testResults.length > 0 ? (
                            testResults.map((r, idx) => (
                                <div key={idx} className={`rounded-lg p-4 border ${
                                    r.passed 
                                        ? 'bg-emerald-900/30 border-emerald-600 text-emerald-100' 
                                        : 'bg-rose-900/30 border-rose-600 text-rose-100'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                                            r.passed 
                                                ? 'bg-emerald-600 text-white' 
                                                : 'bg-rose-600 text-white'
                                        }`}>
                                            Case {idx + 1}: {r.passed ? 'PASSED' : 'FAILED'}
                                        </span>
                                        {r.category && (
                                            <span className="text-xs opacity-75">
                                                {r.category === 'error' ? '(Runtime Error)' 
                                                 : r.category === 'stderr' ? '(Execution Error)' 
                                                 : r.category === 'mismatch' ? '(Output Mismatch)' 
                                                 : ''}
                                            </span>
                                        )}
                                    </div>
                                    {r.message && (
                                        <pre className="text-xs whitespace-pre-wrap font-mono bg-neutral-800/50 p-2 rounded border border-neutral-700 text-neutral-100 max-h-40 overflow-auto">
                                            {r.message}
                                        </pre>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-neutral-500 text-sm text-center py-8">
                                <div className="text-neutral-400 mb-2">📋 No test results yet</div>
                                <div className="text-xs">Click the "Submit" button to run all test cases</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestcasePanel;
