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
    <div className="space-y-6">
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

      <div>
        <h1 className="text-2xl font-bold text-primary">Contact Messages</h1>
        <p className="text-secondary text-sm">Inbox for contact form submissions.</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12"><LoadingSpinner /></div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-secondary">
            <Mail className="mx-auto mb-4 opacity-50" size={48} />
            <p>No messages in inbox.</p>
          </div>
        ) : (
          <div className="divide-y divide-theme">
            {messages.map(msg => (
              <div 
                key={msg._id} 
                onClick={() => handleRead(msg)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-glass transition-colors ${!msg.read ? 'bg-blue-500/5' : ''}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`shrink-0 ${!msg.read ? 'text-blue-500' : 'text-muted'}`}>
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${!msg.read ? 'font-bold text-primary' : 'font-medium text-secondary'}`}>
                      {msg.name} <span className="text-muted font-normal text-xs ml-2">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className={`truncate text-sm ${!msg.read ? 'text-primary font-semibold' : 'text-primary'}`}>{msg.subject}</p>
                    <p className="truncate text-sm text-muted hidden md:block">{msg.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {msg.read && <span className="p-1.5 text-emerald-500" title="Read"><CheckCircle2 size={16} /></span>}
                  <button onClick={(e) => handleDelete(msg._id, e)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete">
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
