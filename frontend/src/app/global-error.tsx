"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Application Error
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Something went wrong.
          </h1>

          <p className="mt-3 text-zinc-600">
            The page failed to render. Try again, and if the error persists, restart the development server.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-black px-5 py-3 text-white transition hover:bg-zinc-800"
            >
              Try again
            </button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <pre className="mt-6 overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-100">
              {error.message}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
