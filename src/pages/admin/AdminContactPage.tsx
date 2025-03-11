import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { Loader2 } from "lucide-react";

// Define the expected structure of a message
interface Message {
  id: number;
  user_id: string;
  name: string;
  email: string;
  message: string;
}

const AdminContactPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("id, user_id, name, email, message");

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data as Message[]); // Explicitly cast data to Message[]
    }
    
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-8 mt-10 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-900 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Admin Contact Messages
      </motion.h1>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      )}

      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No messages found.</p>
      )}

      {!loading && messages.length > 0 && (
        <motion.div
          className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-md">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">User ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <motion.tr
                  key={msg.id}
                  className={`border-b hover:bg-gray-100 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <td className="px-6 py-4">{msg.user_id}</td>
                  <td className="px-6 py-4">{msg.name}</td>
                  <td className="px-6 py-4">{msg.email}</td>
                  <td className="px-6 py-4">{msg.message}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminContactPage;
