/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { format, addDays, setHours, setMinutes, isBefore } from 'date-fns';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const OPENING_HOUR = 11;
const CLOSING_HOUR = 22;
const TABLE_CAPACITY = 6;
const TOTAL_TABLES = 10;

interface Reservation {
  id?: string;
  date: string;
  time: string;
  guests: number;
  tablesBooked: number;
  user_id: string;
}

const ReservationPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const Navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user.id);
      if (error) console.error('Error fetching user:', error);
    };
    getUser();
  }, []);

  // Fetch reservations from Supabase (Only Today and Future)
  const fetchReservations = async () => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', user)
      .gte('date', today);

    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      setReservations(data);
    }
  };

  useEffect(() => {
    if (user) fetchReservations();
  }, [user]);

  // Generate available time slots
  const getTimeSlots = () => {
    const slots = [];
    const currentTime = setHours(setMinutes(new Date(date), 0), OPENING_HOUR);
    const closing = setHours(setMinutes(new Date(date), 0), CLOSING_HOUR);

    while (isBefore(currentTime, closing)) {
      const bookedTables = reservations
        .filter((res) => res.time === format(currentTime, 'HH:mm:ss'))
        .reduce((acc, res) => acc + res.tablesBooked, 0);

      slots.push({ time: new Date(currentTime), available: bookedTables < TOTAL_TABLES });

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    if (!user) {
      toast.error('You must be logged in to make a reservation');
      Navigate('/auth');
      return;
    }

    const tablesNeeded = Math.ceil(guests / TABLE_CAPACITY);
    const bookedTables = reservations
      .filter((res) => res.time === format(selectedTime, 'HH:mm:ss'))
      .reduce((acc, res) => acc + res.tablesBooked, 0);

    if (bookedTables + tablesNeeded > TOTAL_TABLES) {
      toast.error('All tables are fully booked for this slot');
      return;
    }

    setIsSubmitting(true);

    const newReservation: Omit<Reservation, 'id'> = {
      date: format(date, 'yyyy-MM-dd'),
      time: format(selectedTime, 'HH:mm:ss'),
      guests,
      tablesBooked: tablesNeeded,
      user_id: user,
    };

    const { data, error } = await supabase.from('reservations').insert([newReservation]).select();

    if (error) {
      toast.error('Error making reservation');
      console.error(error);
    } else {
      toast.success('Reservation confirmed!');
      setReservations([...reservations, data[0]]); // Update reservations immediately
    }

    setIsSubmitting(false);
  };

  // Delete a reservation
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) {
      toast.error('Error deleting reservation');
      console.error(error);
    } else {
      setReservations(reservations.filter((res) => res.id !== id));
      toast.success('Reservation deleted');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-9">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Reservation</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <DatePicker selected={date} onChange={(date: Date) => setDate(date)} minDate={new Date()} maxDate={addDays(new Date(), 30)} className="w-full p-2 border rounded" />
            <div className="flex gap-4">
              <button type="button" onClick={() => setGuests((prev) => Math.max(prev - 1, 1))} className="p-2 border rounded">-</button>
              <span>{guests}</span>
              <button type="button" onClick={() => setGuests((prev) => Math.min(prev + 1, 60))} className="p-2 border rounded">+</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {getTimeSlots().map((slot, index) => (
                <button key={index} type="button" disabled={!slot.available} onClick={() => setSelectedTime(slot.time)} className={`p-2 border rounded ${slot.available ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                  {format(slot.time, 'h:mm a')}
                </button>
              ))}
            </div>
            <button type="submit" disabled={isSubmitting || !selectedTime} className="w-full p-3 bg-blue-500 text-white rounded">
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold">Your Reservations</h2>
          {reservations.map((res) => (
            <div key={res.id} className="p-4 border rounded mt-2 flex justify-between">
              <p>{format(new Date(res.date), 'MMMM d, yyyy')} at {format(new Date(`1970-01-01T${res.time}`), 'h:mm a')}</p>
              <button onClick={() => handleDelete(res.id!)} className="text-red-500">Delete</button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReservationPage;
