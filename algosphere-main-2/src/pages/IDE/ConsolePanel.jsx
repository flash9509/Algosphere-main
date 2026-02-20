import React from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ConsolePanel - Collapsible console output display
 */
const ConsolePanel = ({
    output,
    status,
    isExpanded,
    onToggle,
    stdin,
    onStdinChange,
    useCustomInput,
    onToggleCustomInput,
    autoWrapReturn,
    onToggleAutoWrap
}) => {
    const getOutputStyles = () => {
        switch (status) {
            case 'error':
                return 'text-rose-600';
            case 'success':
                return 'text-emerald-600 font-medium';
            case 'running':
                return 'text-amber-600';
            default:
                return 'text-neutral-700';
        }
    };

    return (
        <div className={`border-t border-neutral-200 bg-gradient-to-br from-neutral-50 to-white transition-all duration-200 shrink-0 ${isExpanded ? 'h-64' : 'h-12'}`}>
            {/* Console Header */}
            <button
                onClick={onToggle}
                className="w-full h-12 px-5 flex items-center justify-between hover:bg-neutral-100/50 transition-colors"
                aria-label={isExpanded ? "Collapse console" : "Expand console"}
            >
                <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-neutral-600" />
                    <span className="text-sm font-medium text-neutral-900">Console</span>
                    {output && !isExpanded && (
                        <span className={`text-xs truncate max-w-[300px] ${getOutputStyles()}`}>
                            {output.slice(0, 50)}...
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronDown size={16} className="text-neutral-600" />
                ) : (
                    <ChevronUp size={16} className="text-neutral-600" />
                )}
            </button>

            {/* Console Output */}
            {isExpanded && (
                <div className="h-52 overflow-y-auto px-5 pb-4 space-y-4">
                    <div>
                        {output ? (
                            <pre className={`font-mono text-sm whitespace-pre-wrap ${getOutputStyles()}`}>
                                {output}
                            </pre>
                        ) : (
                            <div className="h-20 flex items-center justify-center text-neutral-400">
                                <div className="text-center">
                                    <Terminal size={24} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Run your code to see output here</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-neutral-200 pt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Stdin</span>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-xs text-neutral-600">
                                    <input
                                        type="checkbox"
                                        checked={useCustomInput}
                                        onChange={(e) => onToggleCustomInput?.(e.target.checked)}
                                        className="accent-neutral-900"
                                    />
                                    Use custom input
                                </label>
                                <label className="flex items-center gap-2 text-xs text-neutral-600">
                                    <input
                                        type="checkbox"
                                        checked={autoWrapReturn}
                                        onChange={(e) => onToggleAutoWrap?.(e.target.checked)}
                                        className="accent-neutral-900"
                                    />
                                    Auto print return
                                </label>
                            </div>
                        </div>
                        <textarea
                            value={stdin}
                            onChange={(e) => onStdinChange?.(e.target.value)}
                            className="w-full h-20 rounded-lg border border-neutral-200 bg-white text-sm font-mono p-2 resize-none outline-none focus:border-neutral-400"
                            placeholder="Enter input for the program (passed as STDIN)"
                            disabled={!useCustomInput}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsolePanel;
