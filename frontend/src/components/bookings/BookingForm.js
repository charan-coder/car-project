import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingForm() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle: '',
    serviceType: 'Regular Service',
    serviceCenter: '',
    appointmentDate: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, vehicle: response.data[0]._id }));
        }
      } catch (error) {
        setError('Error fetching vehicles');
      }
    };

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', formData);
      navigate('/bookings');
    } catch (error) {
      setError('Error creating booking');
    }
  };

  const serviceCenters = [
    'Downtown Service Center',
    'Westside Auto Care',
    'Central Mechanics',
    'East End Service Station',
  ];

  const serviceTypes = [
    'Regular Service',
    'Oil Change',
    'Repair',
    'Inspection',
    'Other',
  ];

  // Get tomorrow's date as the minimum date for appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please add a vehicle before booking a service.</p>
        <button
          onClick={() => navigate('/vehicles')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Vehicle
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="vehicle" className="block text-gray-700 mb-2">
            Select Vehicle
          </label>
          <select
            id="vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.brand} {vehicle.model} ({vehicle.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="serviceType" className="block text-gray-700 mb-2">
            Service Type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="serviceCenter" className="block text-gray-700 mb-2">
            Service Center
          </label>
          <select
            id="serviceCenter"
            name="serviceCenter"
            value={formData.serviceCenter}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a service center</option>
            {serviceCenters.map((center) => (
              <option key={center} value={center}>
                {center}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointmentDate" className="block text-gray-700 mb-2">
            Preferred Date
          </label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={minDate}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any specific issues or requests..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Book Service
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
