import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/vehicles'),
          axios.get('http://localhost:5000/api/bookings')
        ]);
        setVehicles(vehiclesRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        <Link
          to="/bookings/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book New Service
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicles Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Vehicles</h2>
            <Link
              to="/vehicles"
              className="text-blue-500 hover:text-blue-700"
            >
              View All
            </Link>
          </div>
          {vehicles.length === 0 ? (
            <p className="text-gray-500">No vehicles added yet.</p>
          ) : (
            <ul className="space-y-3">
              {vehicles.slice(0, 3).map((vehicle) => (
                <li key={vehicle._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-sm text-gray-500">{vehicle.registrationNumber}</p>
                  </div>
                  <span className="text-sm">{vehicle.year}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link
              to="/bookings"
              className="text-blue-500 hover:text-blue-700"
            >
              View All
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            <ul className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <li key={booking._id} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{booking.serviceType}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Booking ID: {booking.bookingId}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
