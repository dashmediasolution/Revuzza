export default function MarketingLoading() {
  return (
    <div className="min-h-screen pb-20 p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto space-y-8 animate-pulse">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-3">
                <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-96 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="flex gap-4">
                <div className="h-11 w-40 bg-gray-200 rounded-full"></div>
            </div>
        </div>

        {/* Top Campaign Banner / Stats */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[200px] flex flex-col justify-between">
            <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
            <div className="flex gap-8">
                <div className="h-16 w-32 bg-gray-100 rounded-xl"></div>
                <div className="h-16 w-32 bg-gray-100 rounded-xl"></div>
                <div className="h-16 w-32 bg-gray-100 rounded-xl"></div>
            </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[320px] flex flex-col gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded-lg mt-4"></div>
                    <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded-lg"></div>
                    <div className="mt-auto h-10 w-full bg-gray-50 rounded-xl"></div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}