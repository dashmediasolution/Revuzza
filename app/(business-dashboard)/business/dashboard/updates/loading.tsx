export default function UpdatesLoading() {
  return (
    <div className="min-h-screen pb-20 p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto space-y-8 animate-pulse">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-3">
                <div className="h-8 w-56 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-80 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="flex gap-4">
                <div className="h-11 w-36 bg-gray-200 rounded-full"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (Feed / Posts) */}
            <div className="xl:col-span-2 space-y-8">
                {/* Create Update Box */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center gap-4 h-[120px]">
                    <div className="h-12 w-12 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="h-12 w-full bg-gray-50 rounded-full border border-gray-100"></div>
                </div>

                {/* Post Cards */}
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[280px] flex flex-col gap-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded-lg"></div>
                                <div className="h-3 w-24 bg-gray-100 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                            <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                            <div className="h-4 w-2/3 bg-gray-100 rounded-lg"></div>
                        </div>
                        <div className="mt-auto h-32 w-full bg-gray-50 rounded-xl"></div>
                    </div>
                ))}
            </div>

            {/* Right Column (Sidebar Widgets) */}
            <div className="xl:col-span-1 space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[350px]"></div>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[250px]"></div>
            </div>

        </div>

      </div>
    </div>
  );
}