import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Activity, BarChart3, TrendingUp } from "lucide-react";
import { CHART_VIEWS, COLORS } from "../utils/constants";
import { CustomTooltip } from "../utils/dataHelpers";

const ChartSection = ({
  mainData,
  forecastData,
  chartView,
  setChartView,
  handleChartClick,
  comparisonMode,
}) => {
  const renderChart = () => {
    const chartData = [...mainData, ...forecastData];

    switch (chartView) {
      case CHART_VIEWS.BAR:
        return (
          <BarChart data={chartData} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              fill={COLORS.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case CHART_VIEWS.LINE:
        return (
          <LineChart data={mainData} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.primary}
              strokeWidth={3}
              dot={{ fill: COLORS.primary, r: 4 }}
            />
            {forecastData.length > 0 && (
              <Line
                type="monotone"
                dataKey="revenue"
                data={[...mainData.slice(-1), ...forecastData]}
                stroke={COLORS.primary}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: COLORS.primary, r: 4 }}
                opacity={0.5}
              />
            )}
          </LineChart>
        );

      default:
        return (
          <AreaChart data={chartData} onClick={handleChartClick}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.primary}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-gray-950 rounded-xl p-4 lg:p-6 border border-gray-900 mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold">Revenue Overview</h2>
          <p className="text-gray-500 text-sm mt-1">
            Click on any data point for details
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-900 rounded-lg p-1">
            {[
              { type: CHART_VIEWS.AREA, icon: Activity },
              { type: CHART_VIEWS.BAR, icon: BarChart3 },
              { type: CHART_VIEWS.LINE, icon: TrendingUp },
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setChartView(type)}
                className={`p-1.5 rounded transition-all ${
                  chartView === type
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-400">Current</span>
            </div>
            {comparisonMode && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span className="text-gray-400">Previous</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
              <span className="text-gray-400">Forecast</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[300px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
