import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { supabase } from "../../lib/supabase";

interface OrderStat {
  delivered: number;
  notDelivered: number;
}

interface OrderData {
  date: string;
  count: number;
}

const AdminDashboard = () => {
  const [orderStats, setOrderStats] = useState<OrderStat>({ delivered: 0, notDelivered: 0 });
  const [dailyOrders, setDailyOrders] = useState<OrderData[]>([]);
  const [cumulativeOrders, setCumulativeOrders] = useState<OrderData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchOrderStats(selectedDate);
    fetchDailyOrders();
    fetchCumulativeOrders();
  }, [selectedDate]);

  // Fetch Delivered & Not Delivered Order Count for Selected Date
  const fetchOrderStats = async (date: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("delivered")
      .eq("order_date", date);

    if (error) {
      console.error("Error fetching order stats:", error);
      return;
    }

    const delivered = data.filter((order: { delivered: boolean }) => order.delivered).length;
    const notDelivered = data.filter((order: { delivered: boolean }) => !order.delivered).length;

    setOrderStats({ delivered, notDelivered });
  };

  // Fetch Orders Per Day
  const fetchDailyOrders = async () => {
    const { data, error } = await supabase.from("orders").select("order_date");

    if (error) {
      console.error("Error fetching daily orders:", error);
      return;
    }

    const counts: Record<string, number> = {};
    data.forEach(({ order_date }: { order_date: string }) => {
      const date = order_date.split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });

    setDailyOrders(Object.entries(counts).map(([date, count]) => ({ date, count })));
  };

  // Fetch Cumulative Order Trends
  const fetchCumulativeOrders = async () => {
    const { data, error } = await supabase.from("orders").select("order_date");

    if (error) {
      console.error("Error fetching cumulative orders:", error);
      return;
    }

    const counts: Record<string, number> = {};
    let cumulativeTotal = 0;
    data
      .sort((a: { order_date: string }, b: { order_date: string }) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime())
      .forEach(({ order_date }: { order_date: string }) => {
        const date = order_date.split("T")[0];
        cumulativeTotal += 1;
        counts[date] = cumulativeTotal;
      });

    setCumulativeOrders(Object.entries(counts).map(([date, count]) => ({ date, count })));
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Date:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2" />
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Delivered Orders</h2>
          <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Not Delivered Orders</h2>
          <p className="text-2xl font-bold text-red-600">{orderStats.notDelivered}</p>
        </div>
      </div>

      {/* Orders Per Day Chart */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Orders Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyOrders.filter(d => d.date === selectedDate)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Pie Chart */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Status for {selectedDate}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={[{ name: "Delivered", value: orderStats.delivered }, { name: "Not Delivered", value: orderStats.notDelivered }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              <Cell fill="#28a745" />
              <Cell fill="#dc3545" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Order Trends */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Cumulative Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
