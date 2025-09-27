import Link from 'next/link';

const GUIDELINES = [
  { name: 'Writing Principles', path: '/guidelines/writing-principles', icon: '/claim.svg' },
  { name: 'Basics', path: '/guidelines/basics', icon: '/edit.svg' },
  { name: 'Date & Time', path: '/guidelines/date-time', icon: '/clock.svg' },
  { name: 'Tone of Voice', path: '/guidelines/tone-of-voice-principles', icon: '/bullhorn.svg' },
  { name: 'Inclusive Language', path: '/guidelines/inclusive-language', icon: '/holding-heart.svg' },
  { name: 'Numbers and Currencies', path: '/guidelines/numbers-currencies', icon: '/money.svg' },
  { name: 'Buttons', path: '/guidelines/buttons', icon: '/hand-point.svg' },
  { name: 'Links', path: '/guidelines/links', icon: '/link.svg' },
  { name: 'Which term should I use?', path: '/guidelines/which-term', icon: '/alert-question-circle.svg' },
  { name: 'Validation errors', path: '/guidelines/validation-error', icon: '/warning.svg' },
  { name: 'Error messages', path: '/guidelines/error-messages', icon: '/warning-circle.svg' },
  { name: 'Success messages', path: '/guidelines/success-messages', icon: '/check-circle.svg' },
  { name: 'Writing about the screen', path: '/guidelines/writing-about-screens', icon: '/device-mobile.svg' },
  { name: 'Feature discovery', path: '/guidelines/feature-discovery', icon: '/bullseye.svg' },
  { name: 'Release notes', path: '/guidelines/release-notes', icon: '/document-check.svg' },
];

const WORD_LIST = [
  { name: 'Words list', path: '/guidelines/words-list', icon: '/book.svg' },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white dark:bg-neutral-800 border-r border-gray-100 dark:border-neutral-700 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
        <div className="space-y-6 pb-16">
          <div>
          <Link href="/" className="inline-block mb-6 mt-6 w-auto ml-[-8px]">
            <h1 className="text-xl font-bold hover:text-[#031331] hover:bg-neutral-100  p-2 rounded-md transition-colors">
              Carro GPT
            </h1>
          </Link>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">About This Project</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This AI assistant helps with UX copywriting by providing style-consistent suggestions and answers based on the provided knowledge base.
            </p>
          </div>
          <div className="mt-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Words list</h2>
            <nav className="space-y-0">
              {WORD_LIST.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded-md transition-colors"
                >
                  <img src={item.icon} alt={item.name} className="h-5 w-5" />
                  <span className='text-sm'>{item.name}</span>
                </Link>
              ))}
            </nav>
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
                  <img src={item.icon} alt={item.name} className="h-5 w-5" />
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
