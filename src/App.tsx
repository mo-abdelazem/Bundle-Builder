import { useEffect } from 'react';
import { useBundle } from './state/store';
import BundleBuilder from './components/builder/BundleBuilder';
import ReviewPanel from './components/review/ReviewPanel';

function App() {
  const status = useBundle((s) => s.status);
  const init = useBundle((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  if (status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="rounded-2xl bg-primary px-10 py-8">
          <img src="/logo.png" alt="Loading" className="w-44 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-[1277px] px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="mb-4 text-center text-[32px] font-bold text-ink sm:hidden">
        Let's get started!
      </h1>

      <div className="grid gap-6 min-[1292px]:grid-cols-[1fr_380px]">
        <section aria-label="Bundle builder">
          <BundleBuilder />
        </section>

        <aside
          aria-label="Your security system"
          className="min-[1292px]:sticky min-[1292px]:top-8 min-[1292px]:self-start"
        >
          <ReviewPanel />
        </aside>
      </div>
    </main>
  );
}

export default App;
