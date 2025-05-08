import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/all');
      setBookings(response.data);
      
      // Calculate stats
      const newStats = response.data.reduce(
        (acc, booking) => {
          acc.total++;
          acc[booking.status.toLowerCase().replace(' ', '')] =
            (acc[booking.status.toLowerCase().replace(' ', '')] || 0) + 1;
          return acc;
        },
        { total: 0, pending: 0, inprogress: 0, completed: 0, cancelled: 0 }
      );
      setStats(newStats);
    } catch (error) {
      setError('Error fetching bookings');
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      fetchBookings();
    } catch (error) {
      setError('Error updating booking status');
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
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
          <p className="text-blue-600">Pending</p>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
          <p className="text-yellow-600">In Progress</p>
          <p className="text-2xl font-bold">{stats.inprogress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow text-center">
          <p className="text-green-600">Completed</p>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow text-center">
          <p className="text-red-600">Cancelled</p>
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.bookingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.vehicle.brand} {booking.vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusUpdate(booking._id, e.target.value)
                        }
                        className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center text-gray-500 py-8">No bookings found.</div>
      )}
    </div>
  );
}

export default AdminDashboard;
