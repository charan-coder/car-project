import { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleForm from './VehicleForm';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      setError('Error fetching vehicles');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
        setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
      } catch (error) {
        setError('Error deleting vehicle');
      }
    }
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleFormSubmit = async (vehicleData) => {
    try {
      if (selectedVehicle) {
        await axios.put(`http://localhost:5000/api/vehicles/${selectedVehicle._id}`, vehicleData);
      } else {
        await axios.post('http://localhost:5000/api/vehicles', vehicleData);
      }
      fetchVehicles();
      setShowForm(false);
      setSelectedVehicle(null);
    } catch (error) {
      setError('Error saving vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <button
          onClick={() => {
            setSelectedVehicle(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <VehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedVehicle(null);
          }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-gray-500">{vehicle.year}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Registration: {vehicle.registrationNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {vehicle.type}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && !showForm && (
        <div className="text-center text-gray-500 py-8">
          No vehicles added yet. Click "Add Vehicle" to get started.
        </div>
      )}
    </div>
  );
}

export default VehicleList;
