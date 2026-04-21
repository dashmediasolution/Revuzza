export default function ReviewsLoading() {
  return (
    <div className="min-h-screen pb-20 p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto space-y-8 animate-pulse">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-3">
                <div className="h-8 w-56 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-80 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Reviews Grid */}
            <div className="flex-1 w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[600px]">
                <div className="flex justify-between items-center mb-8">
                     <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
                     <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-gray-50 rounded-2xl"></div>
                    ))}
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="w-full xl:w-[380px] bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[600px]"></div>
        </div>
      </div>
    </div>
  );
}