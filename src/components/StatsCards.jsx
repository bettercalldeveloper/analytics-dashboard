import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

const StatsCards = ({ stats }) => {
  const iconMap = {
    revenue: DollarSign,
    orders: ShoppingCart,
    visitors: Users,
    conversion: TrendingUp,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.id];
        return (
          <div
            key={index}
            className="bg-gray-950 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-gray-900 hover:border-gray-800 transition-all group"
          >
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`p-2 lg:p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-gray-500 text-xs lg:text-sm">{stat.title}</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
              <div
                className={`flex items-center text-xs lg:text-sm font-medium ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  <ArrowDown className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
                {stat.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
