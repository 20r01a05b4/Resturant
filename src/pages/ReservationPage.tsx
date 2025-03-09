import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
  differenceInDays,
} from 'date-fns';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

const OPENING_HOUR = 11;
const CLOSING_HOUR = 22;
const TABLE_CAPACITY = 6;
const TOTAL_TABLES = 10;

interface Reservation {
  date: Date;
  time: Date;
  guests: number;
  tablesBooked: number;
}

const ReservationPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    const storedReservations = JSON.parse(
      localStorage.getItem('reservations') || '[]'
    );
    const filteredReservations = storedReservations.filter(
      (res: Reservation) => differenceInDays(new Date(), new Date(res.date)) < 1
    );
    setReservations(filteredReservations);
    localStorage.setItem('reservations', JSON.stringify(filteredReservations));
  }, []);

  const getTimeSlots = () => {
    const slots = [];
    let currentTime = setHours(setMinutes(date, 0), OPENING_HOUR);
    const closing = setHours(setMinutes(date, 0), CLOSING_HOUR);
    while (isBefore(currentTime, closing)) {
      const bookedTables = reservations
        .filter((res) => res.time.getTime() === currentTime.getTime())
        .reduce((acc, res) => acc + res.tablesBooked, 0);
      slots.push({ time: currentTime, available: bookedTables < TOTAL_TABLES });
      currentTime = addDays(currentTime, 0);
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    const tablesNeeded = Math.ceil(guests / TABLE_CAPACITY);
    const bookedTables = reservations
      .filter((res) => res.time.getTime() === selectedTime.getTime())
      .reduce((acc, res) => acc + res.tablesBooked, 0);
    if (bookedTables + tablesNeeded > TOTAL_TABLES) {
      toast.error('All tables are fully booked for this slot');
      return;
    }
    setIsSubmitting(true);
    const newReservation = {
      date,
      time: selectedTime,
      guests,
      tablesBooked: tablesNeeded,
    };
    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setConfirmedReservation(newReservation);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Reservation confirmed!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-9">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make a Reservation
          </h1>
          <p className="text-gray-600">
            Book your table for an unforgettable dining experience
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <DatePicker
              selected={date}
              onChange={(date: Date) => setDate(date)}
              minDate={new Date()}
              maxDate={addDays(new Date(), 30)}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGuests((prev) => Math.max(prev - 1, 1))}
                className="p-2 border rounded"
              >
                -
              </button>
              <span>{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((prev) => Math.min(prev + 1, 60))}
                className="p-2 border rounded"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {getTimeSlots().map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={
                    slot.available
                      ? 'p-2 border rounded bg-green-500 text-white'
                      : 'p-2 border rounded bg-gray-300'
                  }
                >
                  {format(slot.time, 'h:mm a')}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !selectedTime}
              className="w-full p-3 bg-blue-500 text-white rounded"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </form>
        </div>
        {confirmedReservation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-green-100 p-4 rounded"
          >
            <h2 className="text-lg font-bold">Reservation Details</h2>
            <p>Date: {format(confirmedReservation.date, 'MMMM d, yyyy')}</p>
            <p>Time: {format(confirmedReservation.time, 'h:mm a')}</p>
            <p>Guests: {confirmedReservation.guests}</p>
            <p>Tables Booked: {confirmedReservation.tablesBooked}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ReservationPage;
 