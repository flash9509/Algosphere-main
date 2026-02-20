import { useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function CourseContent() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#e8eaed] flex flex-col">
      
      {/* Top Blue Header */}
      <div className="h-14 bg-[#5b8bd4]"></div>

      {/* Lesson Header */}
      <div className="bg-white px-8 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.href = '/learning-path'}
            className="p-1 rounded-full hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition"
            title="Back to Learning Path"
            aria-label="Back to Learning Path"
            type="button"
          >
            <BookOpen size={24} className="text-gray-600" />
          </button>
          <h2 className="text-base font-normal text-gray-700">
            Lesson 1: What is an AI AgEnt?
          </h2>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === 0 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-10 overflow-y-auto max-h-[70vh]">
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Start with the Problem:
            </h3>

            <p className="mb-2 text-gray-800">
              Imagine you give an instruction:
            </p>

            <p className="mb-8 text-gray-800">
              "Book a flight to Delhi for tomorrow."
            </p>

            <p className="mb-2 text-gray-800">
              ● A normal LLM (like basic ChatGPT) will say:
            </p>

            <p className="mb-8 text-gray-800">
              "Here's how you can book a flight: go to a website like Expedia, choose your date…" → It talks, but doesn't do.
            </p>

            <p className="mb-2 text-gray-800">
              ● An AI Agent hears the same request and actually does it:
            </p>

            <div className="mb-8 text-gray-800 space-y-1">
              <p>1. Opens a browser (via tool)</p>
              <p className="pl-1">2. Searches flights</p>
              <p>3. Picks the best one</p>
              <p>4. Fills your details</p>
              <p>5. Confirms the booking → It thinks, acts, and finishes the job.</p>
            </div>

            <p className="mb-6 text-gray-800">
              So the difference is:
            </p>

            <p className="mb-4 text-gray-800">
              <strong>LLM = Knowledge Engine</strong> — It knows things, explains things, but stops there.
            </p>

            <p className="mb-6 text-gray-800">
              <strong>AI Agent = Action Engine</strong> — It knows, plans, and executes autonomously.
            </p>

            <p className="mb-4 text-gray-800">
              Think of it like this:
            </p>

            <p className="mb-2 text-gray-800">
              ● LLM is like a brilliant advisor who gives you all the steps.
            </p>

            <p className="mb-6 text-gray-800">
              ● AI Agent is like a personal assistant who actually does all the steps for you.
            </p>

            <p className="mb-4 text-gray-800">
              <strong>Key Components of an AI Agent:</strong>
            </p>

            <div className="mb-6 text-gray-800 space-y-1">
              <p>1. <strong>Perception</strong> — Understanding the user's intent</p>
              <p>2. <strong>Reasoning</strong> — Planning the steps to achieve the goal</p>
              <p>3. <strong>Action</strong> — Executing tasks using tools (APIs, browsers, etc.)</p>
              <p>4. <strong>Memory</strong> — Remembering context across interactions</p>
              <p>5. <strong>Learning</strong> — Improving from feedback and outcomes</p>
            </div>

            <p className="text-gray-800">
              In the next lesson, we'll dive deeper into how these components work together to create powerful autonomous systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
