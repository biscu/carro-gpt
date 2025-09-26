'use client';

interface ThinkingProps {
  isVisible: boolean;
}

export default function Thinking({ isVisible }: ThinkingProps) {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_1s_linear_infinite]">Thinking</span>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
