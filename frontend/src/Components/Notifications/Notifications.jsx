import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // For sending notification
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/notifications/unread', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/notifications/${notification.id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the notification from the list after marking it as read
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:8000/api/notifications/search-users?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleSend = async () => {
    const token = localStorage.getItem('token');
    try {
      setSending(true);
      await axios.post(
        'http://localhost:8000/api/notifications/send',
        {
          ReceivedId: selectedUser.id,
          Content: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSendSuccess('Notification sent!');
      setShowForm(false);
      setSearchQuery('');
      setMessage('');
      setSelectedUser(null);
    } catch (err) {
      console.error('Error sending notification:', err);
      setSendSuccess('Failed to send.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="notification-container">
      <h3 className="notification-title">Unread Notifications</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="no-notifications">No unread notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="notification-item"
              onClick={() => handleNotificationClick(notification)}
            >
              📩 {notification.Content} — {notification.TimeSent}
            </li>
          ))}
        </ul>
      )}

      {selectedNotification && (
        <div className="notification-details">
          <h4>Notification Details</h4>
          <p><strong>From:</strong> {selectedNotification.SenderName}</p>
          <p><strong>Sent At:</strong> {selectedNotification.TimeSent}</p>
          <p><strong>Message:</strong> {selectedNotification.Content}</p>
        </div>
      )}

      <div className="send-notification-section">
        <button onClick={() => setShowForm(!showForm)} className="send-notification-button">
          {showForm ? 'Cancel' : 'Send Notification'}
        </button>

        {showForm && (
          <div className="send-form">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <ul className="search-results">
              {searchResults.map((user) => (
                <li key={user.id} onClick={() => setSelectedUser(user)}>
                  {user.FullName} ({user.Email})
                </li>
              ))}
            </ul>

            {selectedUser && (
              <>
                <textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSend} disabled={sending}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </>
            )}
          </div>
        )}

        {sendSuccess && <p>{sendSuccess}</p>}
      </div>
    </div>
  );
}

export default Notifications;
