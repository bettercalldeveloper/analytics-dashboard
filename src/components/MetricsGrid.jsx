import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MetricsGrid = ({ mainData, topProducts, trafficSources }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Conversion Metrics */}
      <div className="bg-gray-950 rounded-xl p-4 lg:p-6 border border-gray-900">
        <h3 className="text-lg font-semibold mb-4">Conversion Metrics</h3>
        <div className="space-y-4">
          {[
            { label: "Conversion Rate", value: 3.2, target: 4, color: "blue" },
            { label: "Bounce Rate", value: 42.5, target: 35, color: "purple" },
            {
              label: "Avg. Session",
              value: 2.8,
              target: 3.5,
              color: "emerald",
            },
          ].map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <span className="text-sm font-medium">{metric.value}%</span>
              </div>
              <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${metric.value}%`,
                    backgroundColor:
                      metric.color === "blue"
                        ? "#3b82f6"
                        : metric.color === "purple"
                        ? "#8b5cf6"
                        : "#10b981",
                  }}
                />
                <div
                  className="absolute inset-y-0 w-0.5 bg-gray-600"
                  style={{ left: `${metric.target}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="visitors" stroke="#6b7280" fontSize={10} />
              <YAxis dataKey="orders" stroke="#6b7280" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#030712",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Scatter
                name="Sessions"
                data={mainData.slice(-7)}
                fill="#3b82f6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-gray-950 rounded-xl p-4 lg:p-6 border border-gray-900">
        <h3 className="text-lg font-semibold mb-4">Top Products</h3>
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {product.name}
                </span>
                <span className="text-sm font-medium">
                  ${(product.revenue / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 group-hover:opacity-80"
                  style={{
                    width: `${
                      (product.revenue / topProducts[0].revenue) * 100
                    }%`,
                    backgroundColor: product.color,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {(
                    (product.revenue /
                      topProducts.reduce((sum, p) => sum + p.revenue, 0)) *
                    100
                  ).toFixed(0)}
                  % of total
                </span>
                <span
                  className={`text-xs font-medium ${
                    product.growth > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {product.growth > 0 ? "+" : ""}
                  {product.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-gray-950 rounded-xl p-4 lg:p-6 border border-gray-900">
        <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#030712",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mt-4">
          {trafficSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm text-gray-400">{source.source}</span>
              </div>
              <span className="text-sm font-medium">{source.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;
