import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
      {/* 404 Text */}
      <h1 className="text-6xl font-extrabold text-green-800 mb-2">
        404
      </h1>

      {/* Title */}
      <h2 className="text-2xl font-bold text-green-700 mb-3">
        Oops! Pet Not Found
      </h2>

      {/* Description */}
      <p className="text-green-600 max-w-md mb-6 text-sm leading-relaxed">
        Looks like this page wandered off like a curious little puppy 🐶  
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
        Back Home
        </Link>

        <Link
          href="/pets"
          className="px-5 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-100 transition"
        >
          Browse Pets
        </Link>
      </div>

      {/* Small footer text */}
      <p className="text-xs text-green-500 mt-6">
        PawHome • Find your perfect companion 💚
      </p>

    </div>
  );
}