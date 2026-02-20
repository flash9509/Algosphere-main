import React, { useMemo, memo, useState } from 'react';
import { ArrowLeft, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TabBar from './TabBar';

/**
 * ProblemPanel - Displays problem description, examples, and constraints
 * Memoized for performance optimization
 */
const ProblemPanel = memo(({ problem, onBack }) => {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Description' }
    ];

    // Build markdown description from problem fields
    const fullDescription = useMemo(() => {
        if (!problem) return "";

        const cleanDesc = (problem.description || "")
            .replace(/(?:Example \d:|Constraints:)[\s\S]*/, '')
            .trim();

        let desc = `${cleanDesc} \n\n`;

        if (problem.examples && problem.examples.length > 0) {
            desc += `### Examples\n\n`;
            problem.examples.forEach(ex => {
                desc += `**Example ${ex.example_num}:**\n`;
                desc += "```\n" + ex.example_text + "\n```\n\n";
            });
        }

        if (problem.constraints && problem.constraints.length > 0) {
            desc += `### Constraints\n\n`;
            desc += problem.constraints.map(c => `- \`${c}\``).join('\n');
        }

        return desc;
    }, [problem]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-emerald-400';
            case 'Medium':
                return 'text-amber-400';
            case 'Hard':
                return 'text-rose-400';
            default:
                return 'text-neutral-400';
        }
    };

    return (
        <div className="w-full h-full flex flex-col border-r border-neutral-700 bg-neutral-900">
            {/* Tab Bar */}
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

            {/* Problem Header */}
            <div className="p-5 border-b border-neutral-700">
                <h1 className="text-xl font-medium text-white mb-3 leading-tight">
                    {problem.id}. {problem.title}
                </h1>

                <div className="flex items-center gap-3 flex-wrap mb-4">
                    <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                    </span>
                    {problem.tags && problem.tags.slice(0, 3).map(tag => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Like/Dislike Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                        <ThumbsUp size={16} />
                        <span>67.5K</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                        <ThumbsDown size={16} />
                        <span>1.2K</span>
                    </div>
                </div>
            </div>

            {/* Problem Description */}
            {activeTab === 'description' && (
                <div className="flex-1 overflow-auto p-5 custom-scrollbar">
                    <div className="prose prose-sm prose-invert max-w-none min-w-full
                        prose-headings:text-white prose-headings:font-semibold prose-headings:mb-3
                        prose-p:text-neutral-300 prose-p:leading-relaxed
                        prose-code:text-emerald-400 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-code:border prose-code:border-neutral-700
                        prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-700 prose-pre:rounded-lg prose-pre:shadow-sm
                        prose-li:text-neutral-300 prose-li:marker:text-neutral-500
                        prose-strong:text-white prose-strong:font-semibold"
                    >
                        <ReactMarkdown>{fullDescription}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
});

ProblemPanel.displayName = 'ProblemPanel';

export default ProblemPanel;
