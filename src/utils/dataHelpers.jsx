export const generateData = (days = 30, offset = 0) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i - offset);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseRevenue = isWeekend ? 35000 : 50000;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date,
      revenue: Math.floor(
        baseRevenue + Math.random() * 20000 + (days - i) * 300
      ),
      orders: Math.floor((isWeekend ? 80 : 120) + Math.random() * 50),
      visitors: Math.floor((isWeekend ? 600 : 1000) + Math.random() * 400),
      conversionRate: (2 + Math.random() * 2).toFixed(2),
      avgOrderValue: Math.floor(300 + Math.random() * 200),
      bounceRate: (30 + Math.random() * 20).toFixed(1),
      pageViews: Math.floor((isWeekend ? 1500 : 2500) + Math.random() * 1000),
    });
  }
  return data;
};

export const generateTopProducts = () => [
  { name: "Premium Plan", revenue: 45000, growth: 12.5, color: "#3b82f6" },
  { name: "Basic Plan", revenue: 32000, growth: 8.3, color: "#8b5cf6" },
  { name: "Pro Plan", revenue: 28000, growth: -2.5, color: "#10b981" },
  { name: "Enterprise", revenue: 21000, growth: 22.1, color: "#f59e0b" },
  { name: "Starter", revenue: 15000, growth: 5.7, color: "#ef4444" },
];

export const generateTrafficSources = () => [
  { source: "Organic Search", value: 45, color: "#3b82f6" },
  { source: "Direct", value: 25, color: "#8b5cf6" },
  { source: "Social Media", value: 20, color: "#10b981" },
  { source: "Referral", value: 10, color: "#f59e0b" },
];

export const calculateStats = (mainData, comparisonData) => {
  const currentTotal = mainData.reduce((sum, day) => sum + day.revenue, 0);
  const currentOrders = mainData.reduce((sum, day) => sum + day.orders, 0);
  const currentVisitors = mainData.reduce((sum, day) => sum + day.visitors, 0);
  const avgConversion = (
    mainData.reduce((sum, day) => sum + parseFloat(day.conversionRate), 0) /
    mainData.length
  ).toFixed(2);

  const revenueChange = comparisonData
    ? (
        ((currentTotal -
          comparisonData.reduce((sum, day) => sum + day.revenue, 0)) /
          comparisonData.reduce((sum, day) => sum + day.revenue, 0)) *
        100
      ).toFixed(1)
    : 12.5;

  return [
    {
      id: "revenue",
      title: "Total Revenue",
      value: `$${currentTotal.toLocaleString()}`,
      change: `${revenueChange}%`,
      trend: parseFloat(revenueChange) > 0 ? "up" : "down",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      id: "orders",
      title: "Total Orders",
      value: currentOrders.toLocaleString(),
      change: `${8.3}%`,
      trend: "up",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      id: "visitors",
      title: "Total Visitors",
      value: currentVisitors.toLocaleString(),
      change: `${-2.1}%`,
      trend: "down",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      id: "conversion",
      title: "Avg Conversion",
      value: `${avgConversion}%`,
      change: `${5.7}%`,
      trend: "up",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];
};

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div className="bg-gray-950 border border-gray-800 p-3 rounded-lg shadow-xl">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry, index) => {
          if (!entry || !entry.name) return null;
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color || "#3b82f6" }}
              ></div>
              <span className="text-gray-300">{entry.name}:</span>
              <span className="text-white font-medium">
                {typeof entry.value === "number"
                  ? entry.name.includes("Rate")
                    ? `${entry.value}%`
                    : entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};
