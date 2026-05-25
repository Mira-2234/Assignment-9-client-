export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      
      <div className="flex flex-col items-center gap-5">

        {/* Spinner container */}
        <div className="relative w-16 h-16">

          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>

          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

          {/* Paw in center */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            🐾
          </div>

        </div>

        {/* Text */}
        <p className="text-green-700 text-sm font-medium animate-pulse">
          Finding your perfect pet...
        </p>

      </div>

    </div>
  );
}