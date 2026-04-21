export default function ShowcaseLoading() {
  return (
    <div className="min-h-screen pb-20 p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto space-y-8 animate-pulse">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-3">
                <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-80 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="flex gap-3">
                <div className="h-10 w-64 bg-gray-100 rounded-full"></div>
                <div className="h-10 w-32 bg-gray-300 rounded-full"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[300px]"></div>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[500px]"></div>
            </div>

            {/* Right Column */}
            <div className="xl:col-span-1 space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[400px]"></div>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[200px]"></div>
            </div>
        </div>

      </div>
    </div>
  );
}