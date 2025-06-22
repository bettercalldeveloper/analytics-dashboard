import {
  Calendar,
  ChevronDown,
  RefreshCw,
  Download,
  Menu,
  BarChart3,
} from "lucide-react";
import { DATE_RANGES } from "../utils/constants";

const Header = ({
  selectedDateRange,
  setSelectedDateRange,
  showDatePicker,
  setShowDatePicker,
  customDateRange,
  setCustomDateRange,
  comparisonMode,
  setComparisonMode,
  handleRefresh,
  handleExport,
  refreshing,
  setMobileMenuOpen,
  mobileMenuOpen,
}) => {
  return (
    <div className="bg-gray-950 border-b border-gray-900 sticky top-0 z-40">
      <div className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Analytics Pro
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-all"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {selectedDateRange === DATE_RANGES.LAST_7_DAYS
                    ? "Last 7 Days"
                    : selectedDateRange === DATE_RANGES.LAST_30_DAYS
                    ? "Last 30 Days"
                    : selectedDateRange === DATE_RANGES.LAST_90_DAYS
                    ? "Last 90 Days"
                    : "Custom"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl p-4 z-50">
                  <div className="space-y-1">
                    {Object.values(DATE_RANGES).map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedDateRange(range);
                          setShowDatePicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedDateRange === range
                            ? "bg-blue-500/20 text-blue-400"
                            : "text-gray-300 hover:bg-gray-900"
                        }`}
                      >
                        {range === DATE_RANGES.LAST_7_DAYS
                          ? "Last 7 Days"
                          : range === DATE_RANGES.LAST_30_DAYS
                          ? "Last 30 Days"
                          : "Last 90 Days"}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mb-3">Custom Range</p>
                    <div className="space-y-2">
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        value={customDateRange.start}
                        onChange={(e) =>
                          setCustomDateRange({
                            ...customDateRange,
                            start: e.target.value,
                          })
                        }
                      />
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        value={customDateRange.end}
                        onChange={(e) =>
                          setCustomDateRange({
                            ...customDateRange,
                            end: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                comparisonMode
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
              }`}
            >
              Compare
            </button>

            <button
              onClick={handleRefresh}
              className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-all"
              disabled={refreshing}
              title="Refresh (Ctrl+R)"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin" : ""
                } text-gray-400`}
              />
            </button>

            <button
              onClick={handleExport}
              className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-all"
              title="Export (Ctrl+E)"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`p-2 rounded-lg transition-all ${
                comparisonMode
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-gray-900 text-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 bg-gray-900 rounded-lg"
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
