export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen pb-20 p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto space-y-8 animate-pulse">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-3">
                <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-96 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>

        {/* Top KPIs */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[140px]"></div>

        {/* Search Metrics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[280px]"></div>
            <div className="xl:col-span-1 bg-gray-200 rounded-3xl p-8 shadow-sm h-[280px]"></div>
        </div>

        {/* Search Table */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[400px]"></div>
      </div>
    </div>
  );
}