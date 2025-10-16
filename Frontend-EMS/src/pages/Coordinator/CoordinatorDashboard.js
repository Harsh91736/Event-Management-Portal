import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';

const CoordinatorHome = () => {
  return (
    <div className="dashboard">
      <div className="section">
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-md)'
        }}>
          🎯 Coordinator Dashboard
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xxl)' }}>
          Create and manage exciting events for your club!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-lg)',
          marginTop: 'var(--space-xl)'
        }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎪</div>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary-gradient-start)' }}>Create Events</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Organize amazing events and engage students</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📋</div>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--secondary-gradient-start)' }}>Manage Events</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Track and monitor all your events</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✅</div>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--success-gradient-start)' }}>Approval Status</h3>
            <p style={{ color: 'var(--text-secondary)' }}>View event approval status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateEvent = () => {
  const { showSuccess, showError, showWarning } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    contactEmail: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.date || !formData.time || !formData.venue) {
      showWarning('Please fill in all required fields');
      return;
    }

    try {
      const response = await api.post('/coordinator/create-event', formData);
      showSuccess(response.data.message || 'Event created successfully! Waiting for faculty approval.');
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        address: '',
        contactEmail: '',
        image: ''
      });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="dashboard">
      <div className="section">
        <h2 style={{
          fontSize: '2rem',
          background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-xl)'
        }}>
          🎪 Create New Event
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Enter venue name"
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address of the venue"
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/event-image.jpg"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
            🎪 Create Event →
          </button>
        </form>
      </div>
    </div>
  );
};

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/coordinator/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="section">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>⏳ Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="section">
        <h2 style={{
          fontSize: '2rem',
          background: 'linear-gradient(135deg, var(--secondary-gradient-start), var(--secondary-gradient-end))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-xl)'
        }}>
          📋 My Events
        </h2>
        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xxl)' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 var(--space-md) 0' }}>🎪</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No events created yet. Start creating amazing events!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td><strong>{event.name}</strong></td>
                    <td>📅 {new Date(event.date).toLocaleDateString()}</td>
                    <td>🕐 {event.time}</td>
                    <td>📍 {event.venue}</td>
                    <td>
                      {event.status === 'approved' && (
                        <span className="badge-success">✓ Approved</span>
                      )}
                      {event.status === 'rejected' && (
                        <span className="badge-danger">✗ Rejected</span>
                      )}
                      {event.status === 'pending' && (
                        <span className="badge-pending">⏳ Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const CoordinatorDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/coordinator' },
    { label: 'Create Event', path: '/coordinator/create-event' },
    { label: 'My Events', path: '/coordinator/events' }
  ];

  return (
    <>
      <Navbar role="coordinator" navItems={navItems} />
      <Routes>
        <Route path="/" element={<CoordinatorHome />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<MyEvents />} />
      </Routes>
    </>
  );
};

export default CoordinatorDashboard;
