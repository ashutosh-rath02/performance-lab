import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          Frontend Performance Testing Lab
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Performance Test Scenarios
            </h2>
            <div className="space-y-4">
              <Link
                href="/scenarios/list-rendering"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold text-lg">List Rendering</h3>
                <p className="text-gray-600">
                  Test performance with large lists
                </p>
              </Link>
              <Link
                href="/scenarios/image-loading"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold text-lg">Image Loading</h3>
                <p className="text-gray-600">
                  Image loading strategies and optimizations
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-600">
              A comprehensive testing environment for measuring and optimizing
              frontend performance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
