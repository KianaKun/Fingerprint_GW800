import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/mesin" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Back to Dashboard
      </Link>
    </div>
  );
}
