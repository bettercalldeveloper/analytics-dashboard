import { X } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "../utils/dataHelpers";
import { COLORS } from "../utils/constants";

const DetailModal = ({ show, onClose, data }) => {
  if (!show || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-950 border-b border-gray-900 p-4 lg:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Detailed View - {data.date}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Hourly breakdown</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-xl font-bold mt-1">
                ${data.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-xl font-bold mt-1">{data.totalOrders}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Visitors</p>
              <p className="text-xl font-bold mt-1">
                {data.totalVisitors.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <p className="text-xl font-bold mt-1">{data.conversionRate}%</p>
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="orders"
                  fill={COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
