import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { CalendarDays, Users, Clock, Table } from "lucide-react";

interface Reservation {
  id: number;
  user_id: string;
  time: string;
  guests: number;
  tablesBooked: number;
  created_at: string;
}

const AdminReservationPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate]);

  async function fetchReservations(date: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("date", date)
        .order("time", { ascending: true });

      if (error) throw error;

      setReservations(data as Reservation[]); // Type assertion
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  }

  function getTodayDate() {
    return new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-900 dark:text-white tracking-wide"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Reservations
      </motion.h1>

      <div className="flex justify-center mt-6">
        <div className="relative">
          <CalendarDays className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="date"
            className="pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-6 animate-pulse">Fetching reservations...</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                className="bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg p-6 rounded-xl text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">User ID: {reservation.user_id}</h2>
                    <p className="flex items-center gap-2 mt-2 text-sm">
                      <Clock size={18} /> Time: <span className="font-semibold">{reservation.time}</span>
                    </p>
                    <p className="flex items-center gap-2 mt-2 text-sm">
                      <Users size={18} /> Guests: <span className="font-semibold">{reservation.guests}</span>
                    </p>
                    <p className="flex items-center gap-2 mt-2 text-sm">
                      <Table size={18} /> Tables Booked: <span className="font-semibold">{reservation.tablesBooked}</span>
                    </p>
                    <p className="text-xs text-gray-200 mt-4">Created at: {new Date(reservation.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No reservations found for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReservationPage;
