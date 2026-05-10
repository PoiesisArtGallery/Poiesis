export default function FailedPage() {

  return (

    <main className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Payment Failed
      </h1>

      <p className="mb-6">
        Payment could not be completed.
      </p>

      <a
        href="/checkout"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Try Again
      </a>

    </main>
  )
}