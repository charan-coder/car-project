import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      setError('Error fetching bookings');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.patch(`http://localhost:5000/api/bookings/${id}/cancel`);
        fetchBookings();
      } catch (error) {
        setError('Error cancelling booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <Link
          to="/bookings/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Booking
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">{booking.serviceType}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-gray-500">
                  {new Date(booking.appointmentDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Service Center: {booking.serviceCenter}
                </p>
                <p className="text-sm text-gray-600">
                  Booking ID: {booking.bookingId}
                </p>
                {booking.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Notes: {booking.notes}
                  </p>
                )}
              </div>
              {booking.status === 'Pending' && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No bookings found. Click "New Booking" to schedule a service.
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingList;
