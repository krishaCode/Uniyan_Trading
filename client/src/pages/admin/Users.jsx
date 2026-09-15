import { useState, useEffect } from 'react';
import { getUsers, approveUser, rejectUser, suspendUser, deleteUser } from '../../services/userService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Eye, Check, X, ShieldAlert, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers({ search: searchTerm, status: statusFilter, limit: 100 });
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  const handleAction = async (action, id, name) => {
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      if (action === 'approve') await approveUser(id);
      else if (action === 'reject') await rejectUser(id);
      else if (action === 'suspend') await suspendUser(id);
      else if (action === 'delete') await deleteUser(id);
      
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">User Management</h1>
          <p className="text-secondary text-sm">Review, approve, and manage student accounts.</p>
        </div>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search by name, email, or NIC..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="input-field md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>NIC</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Registered</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8"><LoadingSpinner /></td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-secondary">No users found matching your criteria.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className={user.status === 'pending' ? 'bg-amber-500/5' : ''}>
                    <td>
                      <div className="font-semibold text-primary">{user.name}</div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </td>
                    <td className="font-mono text-sm">{user.nic}</td>
                    <td className="text-sm">{user.phone}</td>
                    <td>
                      <span className={`badge-${user.status}`}>{user.status.toUpperCase()}</span>
                    </td>
                    <td className="text-sm text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/users/${user._id}`} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="View Details">
                          <Eye size={18} />
                        </Link>
                        
                        {user.status !== 'approved' && (
                          <button onClick={() => handleAction('approve', user._id, user.name)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Approve">
                            <Check size={18} />
                          </button>
                        )}
                        
                        {user.status === 'pending' && (
                          <button onClick={() => handleAction('reject', user._id, user.name)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" title="Reject">
                            <X size={18} />
                          </button>
                        )}
                        
                        {user.status === 'approved' && (
                          <button onClick={() => handleAction('suspend', user._id, user.name)} className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors" title="Suspend">
                            <ShieldAlert size={18} />
                          </button>
                        )}
                        
                        <button onClick={() => handleAction('delete', user._id, user.name)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
