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
    <div className="admin-users-page">
      <Toaster position="top-right" />
      
      <div className="users-page-heading">
        <div>
          <p className="dashboard-kicker">ACCOUNT DIRECTORY</p>
          <h1>User management</h1>
          <p>Review, approve, and manage student accounts from one organized workspace.</p>
        </div>
        <div className="users-summary"><strong>{users.length}</strong><span>visible accounts</span></div>
      </div>

      <div className="users-filter-panel">
        <div className="users-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or NIC..." 
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="users-filter-select">
          <label htmlFor="user-status-filter">Status</label>
          <select
            id="user-status-filter"
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="users-table-panel">
        <div className="users-table-heading">
          <div><h2>Student accounts</h2><p>Use row actions to review profiles and update access status.</p></div>
          <span>{loading ? 'Updating...' : `${users.length} results`}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table users-table">
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
                      <div className="users-row-actions">
                        <Link to={`/admin/users/${user._id}`} className="users-action users-action-view" title="View Details">
                          <Eye size={18} />
                        </Link>
                        
                        {user.status !== 'approved' && (
                          <button onClick={() => handleAction('approve', user._id, user.name)} className="users-action users-action-approve" title="Approve">
                            <Check size={18} />
                          </button>
                        )}
                        
                        {user.status === 'pending' && (
                          <button onClick={() => handleAction('reject', user._id, user.name)} className="users-action users-action-reject" title="Reject">
                            <X size={18} />
                          </button>
                        )}
                        
                        {user.status === 'approved' && (
                          <button onClick={() => handleAction('suspend', user._id, user.name)} className="users-action users-action-suspend" title="Suspend">
                            <ShieldAlert size={18} />
                          </button>
                        )}
                        
                        <button onClick={() => handleAction('delete', user._id, user.name)} className="users-action users-action-delete" title="Delete">
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
