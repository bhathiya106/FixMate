
import React, { useEffect, useState } from 'react';

const Services = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (data.success) setMessages(data.messages);
        else setError(data.message || 'Failed to fetch messages');
      } catch {
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Contact Messages</h2>
      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-400">No messages found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-white">Name</th>
                <th className="px-4 py-2 text-left text-white">Email</th>
                <th className="px-4 py-2 text-left text-white">Phone</th>
                <th className="px-4 py-2 text-left text-white">Service</th>
                <th className="px-4 py-2 text-left text-white">Message</th>
                <th className="px-4 py-2 text-left text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id} className="border-b border-gray-700">
                  <td className="px-4 py-2 text-white">{msg.name}</td>
                  <td className="px-4 py-2 text-white">{msg.email}</td>
                  <td className="px-4 py-2 text-white">{msg.phone || '-'}</td>
                  <td className="px-4 py-2 text-white">{msg.service || '-'}</td>
                  <td className="px-4 py-2 text-white">{msg.message}</td>
                  <td className="px-4 py-2 text-white">{msg.date ? new Date(msg.date).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Services;
