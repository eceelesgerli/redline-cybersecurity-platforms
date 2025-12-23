export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-cyber-red"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-cyber-red rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
