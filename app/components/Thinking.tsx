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
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 font-medium bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_1s_linear_infinite]">Thinking</span>
            <span className="text-gray-600 font-medium">
              <span className="bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_1s_linear_infinite] animate-[dot1_1.5s_linear_infinite]">.</span>
              <span className="bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_1s_linear_infinite] animate-[dot2_1.5s_linear_infinite]">.</span>
              <span className="bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_1s_linear_infinite] animate-[dot3_1.5s_linear_infinite]">.</span>
            </span>
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
          @keyframes dot1 {
            0%, 33% {
              opacity: 0;
            }
            34%, 100% {
              opacity: 1;
            }
          }
          @keyframes dot2 {
            0%, 50% {
              opacity: 0;
            }
            51%, 100% {
              opacity: 1;
            }
          }
          @keyframes dot3 {
            0%, 66% {
              opacity: 0;
            }
            67%, 100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
