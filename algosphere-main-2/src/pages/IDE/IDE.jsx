import React, { useState, useEffect } from 'react';
import { Play, Upload, Code, FileText, Terminal } from 'lucide-react';

// Import all separated components
import ProblemPanel from './ProblemPanel';
import CodeToolbar from './CodeToolbar';
import CodeEditor from './CodeEditor';
import TestcasePanel from './TestcasePanel';
import StatusNotification from './StatusNotification';
import ConsolePanel from './ConsolePanel';
import EmptyState from './EmptyState';

const getRunnerEndpoint = () => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    return `${protocol}//${host}:4002/run`;
};

const parseExampleText = (text = '') => {
    if (!text || typeof text !== 'string') {
        return {
            input: '',
            expected_output: '',
            explanation: ''
        };
    }

    // Normalize newlines
    const normalized = text.replace(/\\n/g, '\n').replace(/\\\n/g, '\n');
    
    // More flexible regex patterns
    const inputMatch = normalized.match(/Input:\s*(.+?)(?=\nOutput:|Output:|$)/is);
    const outputMatch = normalized.match(/Output:\s*(.+?)(?=\nExplanation:|Explanation:|$)/is);
    const explanationMatch = normalized.match(/Explanation:\s*(.+?)$/is);

    return {
        input: (inputMatch?.[1] || '').trim(),
        expected_output: (outputMatch?.[1] || '').trim(),
        explanation: (explanationMatch?.[1] || '').trim()
    };
};

const getStarterCode = (problem, language) => {
    if (problem?.starter_code) {
        if (typeof problem.starter_code === 'string' && problem.starter_code.trim()) {
            return problem.starter_code;
        }
        if (typeof problem.starter_code === 'object') {
            const langCode = problem.starter_code[language];
            if (langCode && String(langCode).trim()) return langCode;
        }
    }

    const title = problem?.title || 'Graph Problem';
    const fallback = {
        java: `// ${title}\n// Read from STDIN, write to STDOUT\n\nimport java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder input = new StringBuilder();\n        String line;\n        while ((line = br.readLine()) != null) {\n            input.append(line).append(\"\\n\");\n        }\n        // TODO: parse input and solve\n        System.out.println(\"\");\n    }\n}\n`,
        python: `# ${title}\n# Read from STDIN, write to STDOUT\nimport sys\n\ndef solve(data: str) -> str:\n    # TODO: parse input and solve\n    return \"\"\n\nif __name__ == \"__main__\":\n    data = sys.stdin.read()\n    print(solve(data))\n`,
        javascript: `// ${title}\n// Read from STDIN, write to STDOUT\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8');\n\nfunction solve(data) {\n  // TODO: parse input and solve\n  return \"\";\n}\n\nprocess.stdout.write(String(solve(input)));\n`,
        cpp: `// ${title}\n// Read from STDIN, write to STDOUT\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // TODO: parse input and solve\n    return 0;\n}\n`
    };

    return fallback[language] || fallback.python;
};

const wrapCodeForRun = (language, code, autoWrapReturn) => {
    if (!autoWrapReturn) return code;
    if (language === 'python') {
        return `${code}\n\n# --- Auto runner: parse stdin assignments and call a likely function ---\nimport sys\nimport inspect\nimport ast\n\ndef _parse_assignments(text):\n    text = (text or '').strip()\n    if not text:\n        return {}, []\n    parts = []\n    buf = []\n    depth = 0\n    in_str = False\n    esc = False\n    for ch in text:\n        if in_str:\n            buf.append(ch)\n            if esc:\n                esc = False\n            elif ch == '\\\\':\n                esc = True\n            elif ch in ('\"', \"'\"):\n                in_str = False\n            continue\n        if ch in ('\"', \"'\"):\n            in_str = True\n            buf.append(ch)\n            continue\n        if ch in '([{':\n            depth += 1\n        elif ch in ')]}':\n            depth = max(0, depth - 1)\n        if ch == ',' and depth == 0:\n            part = ''.join(buf).strip()\n            if part:\n                parts.append(part)\n            buf = []\n        else:\n            buf.append(ch)\n    last = ''.join(buf).strip()\n    if last:\n        parts.append(last)\n    result = {}\n    ordered = []\n    for part in parts:\n        if '=' not in part:\n            continue\n        name, value = part.split('=', 1)\n        name = name.strip()\n        value = value.strip()\n        try:\n            parsed = ast.literal_eval(value)\n            result[name] = parsed\n            ordered.append(parsed)\n        except Exception:\n            result[name] = value\n            ordered.append(value)\n    return result, ordered\n\ndef _pick_function(funcs, vars_dict):\n    if 'solve' in globals() and callable(globals().get('solve')):\n        return globals()['solve'], 'solve'\n    if 'main' in globals() and callable(globals().get('main')):\n        return globals()['main'], 'main'\n    if not funcs:\n        return None, None\n    if len(funcs) == 1:\n        return funcs[0], funcs[0].__name__\n    best = None\n    best_score = -1\n    for f in funcs:\n        try:\n            params = inspect.signature(f).parameters\n            score = sum(1 for k in params.keys() if k in vars_dict)\n            if score > best_score:\n                best = f\n                best_score = score\n        except Exception:\n            continue\n    return best, best.__name__ if best else (None, None)\n\ntry:\n    _stdin = sys.stdin.read()\n    _vars, _ordered = _parse_assignments(_stdin)\n    _funcs = [v for v in globals().values() if inspect.isfunction(v) and v.__module__ == '__main__']\n    _fn, _name = _pick_function(_funcs, _vars)\n    _res = None\n    if _fn:\n        try:\n            _sig = inspect.signature(_fn)\n            if _sig.parameters:\n                _args = []\n                _i = 0\n                for k in _sig.parameters.keys():\n                    if k in _vars:\n                        _args.append(_vars.get(k))\n                    elif _i < len(_ordered):\n                        _args.append(_ordered[_i])\n                        _i += 1\n                    else:\n                        _args.append(None)\n                _res = _fn(*_args)\n            else:\n                _res = _fn()\n        except Exception:\n            _res = None\n    elif 'solve' in globals():\n        _res = solve(_stdin)\n    print(_res)\nexcept Exception:\n    pass\n`;
    }
    if (language === 'javascript') {
        return `${code}\n\n// --- Auto print return value if solve(data) exists ---\ntry {\n  if (typeof solve === 'function') {\n    const fs = require('fs');\n    const _data = fs.readFileSync(0, 'utf8');\n    const _res = solve(_data);\n    if (_res !== undefined) process.stdout.write(String(_res));\n  }\n} catch (e) {}\n`;
    }
    return code;
};

/**
 * IDE - Main Integrated Development Environment component (LeetCode Style)
 * Orchestrates all sub-components and manages state
 */
export default function IDE({ problem, onBack, onNext, onSolved }) {
    // State management
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle', 'running', 'success', 'error'
    const [attempts, setAttempts] = useState(0);
    const [activeTestcase, setActiveTestcase] = useState(0);
    const [testcases, setTestcases] = useState([]);
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);
    const [stdin, setStdin] = useState('');
    const [useCustomInput, setUseCustomInput] = useState(false);
    const [autoWrapReturn, setAutoWrapReturn] = useState(true);
    const [activeTestTab, setActiveTestTab] = useState('testcase');
    const [testResults, setTestResults] = useState([]);
    const languages = [
        { id: 'cpp', name: 'C++' },
        { id: 'java', name: 'Java' },
        { id: 'python', name: 'Python' },
        { id: 'javascript', name: 'JavaScript' }
    ];

    const [selectedLanguage, setSelectedLanguage] = useState('java'); // Default to Java
    const [activeMobileTab, setActiveMobileTab] = useState('problem'); // 'problem', 'editor', 'testcases'

    // Initialize code when problem changes or language changes
    useEffect(() => {
        setCode(getStarterCode(problem, selectedLanguage));
        setOutput("");
        setStatus('idle');
        setAttempts(0);
        setStdin('');
        setUseCustomInput(false);
        setAutoWrapReturn(true);
        setActiveTestTab('testcase');
        setTestResults([]);

        // Use examples as display-only testcases
        if (problem && problem.examples && problem.examples.length > 0) {
            setTestcases(problem.examples.map(ex => parseExampleText(ex.example_text)));
        } else {
            setTestcases([]);
        }
    }, [problem, selectedLanguage]);

    const runSingle = async (stdinValue) => {
        const codeToRun = wrapCodeForRun(selectedLanguage, code, autoWrapReturn);
        const response = await fetch(getRunnerEndpoint(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: selectedLanguage || 'python',
                code: codeToRun,
                stdin: stdinValue || ""
            })
        });
        const result = await response.json();
        return { response, result };
    };

    const handleTestTabChange = (tab) => {
        setActiveTestTab(tab);
        if (tab === 'result' && !isRunning) {
            runCode(true);
        }
    };

    /**
     * Execute code using local runner service
     */
    const runCode = async (isSubmission = false) => {
        // Validate we have code to run
        if (!code || code.trim() === '') {
            setOutput("Error: No code to run. Write some code first!");
            setStatus('error');
            return;
        }

        // Validate we have test cases for submission
        if (isSubmission && testcases.length === 0) {
            setOutput("Error: No test cases available for this problem.");
            setStatus('error');
            return;
        }

        setIsRunning(true);
        setStatus('running');
        setOutput("Running code...");
        setIsConsoleOpen(true);
        setTestResults([]);

        try {
            if (isSubmission && testcases.length > 0) {
                let allPassed = true;
                const results = [];
                
                for (let i = 0; i < testcases.length; i++) {
                    const tc = testcases[i];
                    const stdinValue = useCustomInput ? stdin : (tc.input || '');
                    
                    const { response, result } = await runSingle(stdinValue);

                    if (!response.ok) {
                        const msg = result?.error || result?.stderr || `Request failed (${response.status})`;
                        results.push({ 
                            passed: false, 
                            message: `Runtime Error:\n${msg}`,
                            category: 'error'
                        });
                        allPassed = false;
                        continue;
                    }

                    const stdout = (result?.stdout || '').trim();
                    const stderr = (result?.stderr || '').trim();
                    
                    if (stderr) {
                        results.push({ 
                            passed: false, 
                            message: `Execution Error:\n${stderr}`,
                            category: 'stderr'
                        });
                        allPassed = false;
                        continue;
                    }

                    const expected = (tc.expected_output || '').trim();
                    
                    // If expected output is empty but we got output, consider it wrong
                    if (!expected && stdout) {
                        results.push({ 
                            passed: false, 
                            message: `Expected empty output but got:\n${stdout.substring(0, 100)}${stdout.length > 100 ? '...' : ''}`,
                            category: 'mismatch'
                        });
                        allPassed = false;
                    } 
                    // If expected output exists but stdout doesn't match
                    else if (expected && stdout !== expected) {
                        results.push({ 
                            passed: false, 
                            message: `Expected:\n${expected.substring(0, 100)}${expected.length > 100 ? '...' : ''}\n\nGot:\n${stdout.substring(0, 100)}${stdout.length > 100 ? '...' : ''}`,
                            category: 'mismatch'
                        });
                        allPassed = false;
                    } 
                    // Passed case
                    else {
                        results.push({ 
                            passed: true, 
                            message: stdout ? `Output:\n${stdout.substring(0, 200)}${stdout.length > 200 ? '...' : ''}` : '(empty output - as expected)',
                            category: 'success'
                        });
                    }
                }

                setTestResults(results);
                setActiveTestTab('result');
                setOutput(
                    allPassed 
                        ? `✓ All ${results.length} test case${results.length !== 1 ? 's' : ''} passed!` 
                        : `✗ ${results.filter(r => !r.passed).length} of ${results.length} test case${results.length !== 1 ? 's' : ''} failed`
                );
                handleSubmissionResult(allPassed);
                return;
            }

            // Single test case execution (Run mode, not Submit)
            const activeTc = testcases[activeTestcase];
            const stdinValue = useCustomInput ? stdin : (activeTc?.input || '');
            const { response, result } = await runSingle(stdinValue);

            if (!response.ok) {
                const msg = result?.error || result?.stderr || `Request failed (${response.status})`;
                setOutput(`Error: ${msg}`);
                setStatus('error');
                if (isSubmission) handleSubmissionResult(false);
                return;
            }

            const stdout = result?.stdout || "";
            const stderr = result?.stderr || "";

            if (stderr) {
                setOutput(stderr);
                setStatus('error');
                if (isSubmission) handleSubmissionResult(false);
            } else if (!stdout) {
                setOutput("No output generated.");
                setStatus('idle');
                if (isSubmission) handleSubmissionResult(false);
            } else {
                setOutput(stdout);
                setStatus('success');
                if (isSubmission) handleSubmissionResult(true);
            }
        } catch (error) {
            const errorMsg = error?.message || 'Unknown error occurred';
            setOutput(`Error: ${errorMsg}`);
            setStatus('error');
            if (isSubmission) handleSubmissionResult(false);
        } finally {
            setIsRunning(false);
        }
    };

    /**
     * Handle submission result
     */
    const handleSubmissionResult = (isSuccess) => {
        if (isSuccess) {
            setStatus('success');
            if (onSolved) onSolved();
        } else {
            setStatus('error');
            setAttempts(prev => prev + 1);
        }
    };

    // Show empty state if no problem selected
    if (!problem) {
        return <EmptyState />;
    }

    return (
        <div className="flex flex-col h-full bg-neutral-950 overflow-hidden relative">
            {/* Header - Global CodeToolbar */}
            <CodeToolbar
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                languages={languages}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - Problem Description */}
                {/* Hidden on mobile unless activeTab is 'problem', always visible on desktop */}
                <div className={`
                    ${activeMobileTab === 'problem' ? 'flex' : 'hidden'} 
                    lg:flex lg:w-[40%] h-full border-r border-neutral-700 bg-neutral-900
                `}>
                    <ProblemPanel problem={problem} onBack={onBack} />
                </div>

                {/* Right Panel - Code Editor + Testcases */}
                {/* Hidden on mobile unless activeTab is 'editor' or 'testcases', always visible on desktop */}
                <div className={`
                    ${(activeMobileTab === 'editor' || activeMobileTab === 'testcases') ? 'flex' : 'hidden'}
                    lg:flex lg:w-[60%] flex-col min-w-0 bg-neutral-900
                `}>

                    {/* Code Editor Section */}
                    <div className={`
                        ${activeMobileTab === 'editor' ? 'flex' : 'hidden'}
                        lg:flex flex-1 flex-col overflow-hidden relative
                    `}>
                        <CodeEditor code={code} onChange={setCode} />
                    </div>

                    {/* Testcases & Actions Section */}
                    {/* On Desktop: 30% height. On Mobile: Full height when active */}
                    <div className={`
                        ${activeMobileTab === 'testcases' ? 'flex' : 'hidden'}
                        lg:flex lg:h-[30%] flex-col border-t border-neutral-700 bg-neutral-900
                    `}>
                        {/* Testcase Panel */}
                        <div className="flex-1 overflow-hidden">
                            <TestcasePanel
                                testcases={testcases}
                                activeTestcase={activeTestcase}
                                onTestcaseChange={setActiveTestcase}
                                activeTab={activeTestTab}
                                onTabChange={handleTestTabChange}
                                testResults={testResults}
                            />
                        </div>

                        {/* Desktop Action Buttons (Hidden on Mobile) */}
                        <div className="hidden lg:flex items-center justify-end gap-3 px-4 py-3 border-t border-neutral-700 bg-neutral-900">
                            <button
                                onClick={() => runCode(false)}
                                disabled={isRunning}
                                className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-all ${isRunning
                                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600'
                                    }`}
                            >
                                <Play size={14} fill={isRunning ? "none" : "currentColor"} />
                                Run
                            </button>
                            <button
                                onClick={() => runCode(true)}
                                disabled={isRunning}
                                className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-all ${isRunning
                                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    }`}
                            >
                                <Upload size={14} />
                                Submit
                            </button>
                        </div>
                    </div>

                    <ConsolePanel
                        output={output}
                        status={status}
                        isExpanded={isConsoleOpen}
                        onToggle={() => setIsConsoleOpen(prev => !prev)}
                        stdin={stdin}
                        onStdinChange={setStdin}
                        useCustomInput={useCustomInput}
                        onToggleCustomInput={setUseCustomInput}
                        autoWrapReturn={autoWrapReturn}
                        onToggleAutoWrap={setAutoWrapReturn}
                    />
                </div>
            </div>

            {/* Mobile Floating Action Buttons (Fixed Bottom Right) */}
            <div className={`lg:hidden fixed bottom-20 right-4 flex flex-col gap-3 z-50 transition-transform duration-300 ${activeMobileTab === 'problem' ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <button
                    onClick={() => runCode(false)}
                    disabled={isRunning}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 text-white shadow-lg border border-neutral-700 active:scale-95 transition-all"
                >
                    <Play size={20} fill={isRunning ? "none" : "currentColor"} />
                </button>
                <button
                    onClick={() => runCode(true)}
                    disabled={isRunning}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg active:scale-95 transition-all"
                >
                    <Upload size={20} />
                </button>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden h-16 bg-neutral-900 border-t border-neutral-800 flex items-center justify-around shrink-0 z-40 pb-safe">
                <button
                    onClick={() => setActiveMobileTab('problem')}
                    className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'problem' ? 'text-white' : 'text-neutral-500'}`}
                >
                    <FileText size={20} />
                    <span className="text-[10px] font-medium">Problem</span>
                </button>
                <button
                    onClick={() => setActiveMobileTab('editor')}
                    className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'editor' ? 'text-white' : 'text-neutral-500'}`}
                >
                    <Code size={20} />
                    <span className="text-[10px] font-medium">Code</span>
                </button>
                <button
                    onClick={() => setActiveMobileTab('testcases')}
                    className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'testcases' ? 'text-white' : 'text-neutral-500'}`}
                >
                    <Terminal size={20} />
                    <span className="text-[10px] font-medium">Testcases</span>
                </button>
            </div>

            {/* Status Notifications */}
            <StatusNotification
                status={status}
                attempts={attempts}
                onNext={onNext}
                onDismiss={() => setStatus('idle')}
            />
        </div>
    );
}
