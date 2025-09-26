import Sidebar from '@/app/components/Sidebar';

export default function GuidelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 pl-64 overflow-auto h-screen">
        <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
          {children}
        </div>
      </main>
    </div>
  );
}
