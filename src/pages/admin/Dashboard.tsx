import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "../../lib/supabase";

interface CustomerData {
  date: string;
  count: number;
}

interface OrderData {
  date: string;
  count: number;
}

interface PopularItem {
  item: string;
  count: number;
}

const AdminDashboard = () => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);

  useEffect(() => {
    fetchCustomerData();
    fetchOrderData();
    fetchPopularItems();
  }, []);

  const fetchCustomerData = async () => {
    const { data, error } = await supabase.from("customers").select("created_at");

    if (error) {
      console.error("Error fetching customer data:", error);
      return;
    }

    const formattedData = formatCustomerData(data);
    setCustomerData(formattedData);
  };

  const formatCustomerData = (data: { created_at: string }[]): CustomerData[] => {
    const counts: Record<string, number> = {};

    data.forEach(({ created_at }) => {
      const date = created_at.split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  };

  const fetchOrderData = async () => {
    const { data, error } = await supabase.from("orders").select("created_at");

    if (error) {
      console.error("Error fetching order data:", error);
      return;
    }

    const formattedData = formatCustomerData(data);
    setOrderData(formattedData);
  };

  const fetchPopularItems = async () => {
    const { data, error } = await supabase.from("order_items").select("item_name");

    if (error) {
      console.error("Error fetching popular items:", error);
      return;
    }

    const counts: Record<string, number> = {};

    data.forEach(({ item_name }) => {
      counts[item_name] = (counts[item_name] || 0) + 1;
    });

    const formattedData: PopularItem[] = Object.entries(counts)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count);

    setPopularItems(formattedData);
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customers Per Day */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Customers Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Over Time */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#FF5733" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Most Ordered Items */}
        <div className="bg-white p-4 shadow rounded-lg col-span-2">
          <h2 className="text-xl font-semibold mb-2">Most Ordered Items</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="item" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
