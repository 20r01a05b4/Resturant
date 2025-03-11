import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "../../lib/supabase";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

// Define Order type
interface Order {
  id: number;
  user_id: string;
  item_name: string;
  quantity: number;
  delivered: boolean;
  order_date: string;
}

const AdminOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Record<string, Order[]>>({});
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; orderId: number | null }>({
    show: false,
    orderId: null,
  });

  useEffect(() => {
    fetchOrders();
  }, [filterDate, filterStatus]);

  async function fetchOrders() {
    setLoading(true);
    const formattedDate = filterDate.toISOString().split("T")[0];

    let query = supabase
      .from("orders")
      .select("*")
      .gte("order_date", `${formattedDate} 00:00:00`)
      .lte("order_date", `${formattedDate} 23:59:59`);

    if (filterStatus === "delivered") query = query.eq("delivered", true);
    else if (filterStatus === "not_delivered") query = query.eq("delivered", false);

    const { data, error } = await query;
    if (error) console.error("Error fetching orders:", error);
    else {
      const groupedOrders = data.reduce<Record<string, Order[]>>((acc, order: Order) => {
        acc[order.user_id] = acc[order.user_id] || [];
        acc[order.user_id].push(order);
        return acc;
      }, {});
      setOrders(groupedOrders);
    }
    setLoading(false);
  }

  async function markAsDelivered(orderId: number) {
    setConfirmDialog({ show: false, orderId: null });
    const { error } = await supabase.from("orders").update({ delivered: true }).eq("id", orderId);
    if (error) console.error("Error updating order:", error);
    else fetchOrders();
  }

  return (
    <div className="container mx-auto p-8 mt-10 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-5xl font-extrabold text-center text-gray-900 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Admin Orders
      </motion.h1>

      <div className="flex flex-wrap justify-between items-center bg-white p-6 shadow-lg rounded-xl mb-8">
        <div>
          <label className="font-semibold text-gray-700">Filter by Date:</label>
          <DatePicker
            selected={filterDate}
            onChange={(date: Date | null) => date && setFilterDate(date)}
            className="ml-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Filter by Status:</label>
          <select
            className="ml-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="delivered">Delivered</option>
            <option value="not_delivered">Not Delivered</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      )}

      {!loading && Object.keys(orders).length === 0 && (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      )}

      {!loading &&
        Object.keys(orders).map((userId) => (
          <motion.div
            key={userId}
            className="bg-white p-6 rounded-xl shadow-md mb-6 transition hover:shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">User ID: {userId}</h2>
            <div className="space-y-4">
              {orders[userId].map((order) => (
                <motion.div
                  key={order.id}
                  className="flex justify-between items-center p-4 border-b border-gray-200 transition hover:bg-gray-100 rounded-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{order.item_name}</p>
                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  </div>

                  <div className="flex items-center">
                    {order.delivered ? (
                      <span className="text-green-600 font-bold text-lg">Delivered ✅</span>
                    ) : (
                      <button
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-md"
                        onClick={() => setConfirmDialog({ show: true, orderId: order.id })}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delivery?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to mark this order as delivered?</p>
            <div className="flex justify-around">
              <button
                className="bg-green-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
                onClick={() => confirmDialog.orderId && markAsDelivered(confirmDialog.orderId)}
              >
                <CheckCircle size={18} /> Confirm
              </button>
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                onClick={() => setConfirmDialog({ show: false, orderId: null })}
              >
                <XCircle size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;
