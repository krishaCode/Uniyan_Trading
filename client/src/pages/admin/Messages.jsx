import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markAsRead } from '../../services/contactService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, CheckCircle2, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages({ limit: 100 });
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRead = async (msg) => {
    if (!msg.read) {
      try {
        await markAsRead(msg._id);
        fetchMessages(); // Refresh to update unread count if we had one globally
      } catch (e) { }
    }
    setSelectedMsg(msg);
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
      if (selectedMsg && selectedMsg._id === id) setSelectedMsg(null);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="admin-messages-page">
      <Toaster position="top-right" />
      
      {selectedMsg && (
        <Modal isOpen={true} onClose={() => setSelectedMsg(null)} title="View Message">
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b border-theme">
              <div>
                <h4 className="font-bold text-primary">{selectedMsg.subject}</h4>
                <p className="text-sm text-secondary font-medium">{selectedMsg.name} &lt;{selectedMsg.email}&gt;</p>
              </div>
              <span className="text-xs text-muted">{new Date(selectedMsg.createdAt).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-glass rounded-xl text-primary whitespace-pre-wrap leading-relaxed">
              {selectedMsg.message}
            </div>
          </div>
        </Modal>
      )}

      <div className="messages-page-heading">
        <div>
          <p className="dashboard-kicker">SUPPORT INBOX</p>
          <h1>Contact messages</h1>
          <p>Review questions and requests submitted by learners through the contact form.</p>
        </div>
        <div className="messages-summary-group">
          <div className="messages-summary"><strong>{messages.length}</strong><span>total</span></div>
          <div className="messages-summary unread"><strong>{messages.filter(message => !message.read).length}</strong><span>unread</span></div>
        </div>
      </div>

      <div className="messages-inbox-panel">
        <div className="messages-inbox-heading">
          <div><h2>Inbox</h2><p>Select a message to view the full request.</p></div>
          <span>{loading ? 'Updating...' : `${messages.length} conversations`}</span>
        </div>
        {loading ? (
          <div className="messages-empty"><LoadingSpinner /></div>
        ) : messages.length === 0 ? (
          <div className="messages-empty">
            <Mail className="mx-auto mb-4 opacity-50" size={48} />
            <p>No messages in inbox.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map(msg => (
              <div 
                key={msg._id} 
                onClick={() => handleRead(msg)}
                className={`message-row ${!msg.read ? 'unread' : ''}`}
              >
                <div className="message-icon">
                    <Mail size={20} />
                </div>
                <div className="message-copy">
                    <div className="message-sender"><strong>{msg.name}</strong><span>{msg.email}</span></div>
                    <p className="message-subject">{msg.subject}</p>
                    <p className="message-preview">{msg.message}</p>
                </div>
                <div className="message-meta">
                  <time>{new Date(msg.createdAt).toLocaleDateString()}</time>
                  {msg.read && <span className="message-read"><CheckCircle2 size={14} /> Read</span>}
                </div>
                <div className="message-actions">
                  <button onClick={(e) => handleDelete(msg._id, e)} className="message-delete" title="Delete message">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
