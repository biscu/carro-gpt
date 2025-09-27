import Link from 'next/link';
import { FileText } from 'lucide-react';

const GUIDELINES = [
  { name: 'Writing Principles', path: '/guidelines/writing-principles' },
  { name: 'Basics', path: '/guidelines/basics' },
  { name: 'Date & Time', path: '/guidelines/date-time' },
  { name: 'Tone of Voice', path: '/guidelines/tone-of-voice-principles' },
  { name: 'Inclusive Language', path: '/guidelines/inclusive-language' },
  { name: 'Numbers and Currencies', path: '/guidelines/numbers-currencies' },
  { name: 'Buttons', path: '/guidelines/buttons' },
  { name: 'Links', path: '/guidelines/links' },
  { name: 'Which term should I use?', path: '/guidelines/which-term' },
  { name: 'Validation errors', path: '/guidelines/validation-error' },
  { name: 'Error messages', path: '/guidelines/error-messages' },
  { name: 'Success messages', path: '/guidelines/success-messages' },
  { name: 'Writing about the screen', path: '/guidelines/writing-about-screens' },
  { name: 'Feature discovery', path: '/guidelines/feature-discovery' },
  { name: 'Release notes', path: '/guidelines/release-notes' },
  { name: 'Words list', path: '/guidelines/words-list' },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white dark:bg-neutral-800 border-r border-gray-100 dark:border-neutral-700 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
        <div className="space-y-6">
          <div>
          <Link href="/" className="inline-block mb-6 mt-6 w-auto">
            <h1 className="text-xl font-bold hover:text-[#031331] hover:bg-neutral-100  p-2 rounded-md transition-colors">
              Carro GPT
            </h1>
          </Link>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">About This Project</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This AI assistant helps with UX copywriting by providing style-consistent suggestions and answers based on the provided knowledge base.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Guidelines</h2>
            <nav className="space-y-0">
              {GUIDELINES.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded-md transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span className='text-sm'>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
