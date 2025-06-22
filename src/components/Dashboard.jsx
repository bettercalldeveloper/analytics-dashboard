import { useState, useEffect, useMemo, useCallback } from "react";

import { DATE_RANGES, CHART_VIEWS } from "../utils/constants";
import ChartSection from "./ChartSelection";
import StatsCards from "./StatsCards";
import MetricsGrid from "./MetricsGrid";
import DrilldownModal from "./DrillDownModal";
import {
  calculateStats,
  generateData,
  generateTopProducts,
  generateTrafficSources,
} from "../utils/dataHelpers";
import Header from "./Header";
import { Calendar, Download, X } from "lucide-react";

const Dashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(
    DATE_RANGES.LAST_30_DAYS
  );
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [drilldownData, setDrilldownData] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chartView, setChartView] = useState(CHART_VIEWS.AREA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "r":
            e.preventDefault();
            handleRefresh();
            break;
          case "e":
            e.preventDefault();
            handleExport();
            break;
          case "/":
            e.preventDefault();
            setShowDatePicker(!showDatePicker);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showDatePicker]);

  const mainData = useMemo(() => {
    const days =
      selectedDateRange === DATE_RANGES.LAST_7_DAYS
        ? 7
        : selectedDateRange === DATE_RANGES.LAST_30_DAYS
        ? 30
        : selectedDateRange === DATE_RANGES.LAST_90_DAYS
        ? 90
        : 30;
    return generateData(days);
  }, [selectedDateRange]);

  const comparisonData = useMemo(() => {
    if (!comparisonMode) return null;
    const days =
      selectedDateRange === DATE_RANGES.LAST_7_DAYS
        ? 7
        : selectedDateRange === DATE_RANGES.LAST_30_DAYS
        ? 30
        : selectedDateRange === DATE_RANGES.LAST_90_DAYS
        ? 90
        : 30;
    return generateData(days, days);
  }, [selectedDateRange, comparisonMode]);

  const stats = useMemo(
    () => calculateStats(mainData, comparisonData),
    [mainData, comparisonData]
  );

  const topProducts = useMemo(() => generateTopProducts(), []);
  const trafficSources = useMemo(() => generateTrafficSources(), []);

  const forecastData = useMemo(() => {
    if (mainData.length < 7) return [];

    const lastWeek = mainData.slice(-7);
    const avgGrowth =
      lastWeek.reduce((sum, day, i) => {
        if (i === 0) return 0;
        return sum + (day.revenue - lastWeek[i - 1].revenue);
      }, 0) / 6;

    const forecast = [];
    const lastRevenue = mainData[mainData.length - 1].revenue;
    const lastDate = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i);
      forecast.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.floor(lastRevenue + avgGrowth * i),
        isForecast: true,
      });
    }

    return forecast;
  }, [mainData]);

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload;
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        revenue: Math.floor((clickedData.revenue / 24) * (0.5 + Math.random())),
        orders: Math.floor((clickedData.orders / 24) * (0.5 + Math.random())),
        visitors: Math.floor(
          (clickedData.visitors / 24) * (0.5 + Math.random())
        ),
      }));

      setDrilldownData({
        date: clickedData.date,
        hourlyData,
        totalRevenue: clickedData.revenue,
        totalOrders: clickedData.orders,
        totalVisitors: clickedData.visitors,
        conversionRate: clickedData.conversionRate,
      });
      setShowDrilldown(true);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleExport = useCallback(() => {
    const exportData = {
      dateRange: selectedDateRange,
      exportDate: new Date().toISOString(),
      stats: stats.map((s) => ({
        title: s.title,
        value: s.value,
        change: s.change,
      })),
      data: mainData,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute(
      "download",
      `analytics-export-${new Date().getTime()}.json`
    );
    linkElement.click();
  }, [selectedDateRange, stats, mainData]);

  return (
    <div
      className="min-h-screen bg-black text-gray-100"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <Header
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
        handleRefresh={handleRefresh}
        handleExport={handleExport}
        refreshing={refreshing}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <StatsCards stats={stats} />

        <ChartSection
          mainData={mainData}
          forecastData={forecastData}
          chartView={chartView}
          setChartView={setChartView}
          handleChartClick={handleChartClick}
          comparisonMode={comparisonMode}
        />

        <MetricsGrid
          mainData={mainData}
          topProducts={topProducts}
          trafficSources={trafficSources}
        />

        <div className="hidden lg:block bg-gray-950 rounded-xl p-6 border border-gray-900 mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-900">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Visitors</th>
                  <th className="pb-3 font-medium">Conv. Rate</th>
                  <th className="pb-3 font-medium">Avg. Order</th>
                </tr>
              </thead>
              <tbody>
                {mainData
                  .slice(-5)
                  .reverse()
                  .map((day, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="py-3 text-sm">{day.date}</td>
                      <td className="py-3 text-sm font-medium">
                        ${day.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm">{day.orders}</td>
                      <td className="py-3 text-sm">
                        {day.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm">{day.conversionRate}%</td>
                      <td className="py-3 text-sm">${day.avgOrderValue}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DrilldownModal
        show={showDrilldown}
        onClose={() => setShowDrilldown(false)}
        data={drilldownData}
      />

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden">
          <div className="bg-gray-950 h-full w-64 border-r border-gray-900 p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowDatePicker(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Date Range</span>
              </button>

              <button
                onClick={() => {
                  handleExport();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Export Data</span>
              </button>
            </div>

            <div className="mt-8">
              <p className="text-xs text-gray-500 mb-3">Keyboard Shortcuts</p>
              <div className="space-y-2 text-xs text-gray-400">
                <div>⌘R - Refresh</div>
                <div>⌘E - Export</div>
                <div>⌘/ - Date Range</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
