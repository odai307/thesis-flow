import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// Modal for coordinator to create a user in any department
function CreateUserModal({ isOpen, onClose, onCreated, departments, coordinatorDeptId }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('student');
  const [departmentId, setDepartmentId] = useState(coordinatorDeptId || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (coordinatorDeptId && !departmentId) {
      setDepartmentId(coordinatorDeptId);
    } else if (departments.length > 0 && !departmentId) {
      setDepartmentId(departments[0].id);
    }
  }, [coordinatorDeptId, departments]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!departmentId) {
      setError('Please select a department');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        departmentId,
      });
      onCreated();
      onClose();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('password123');
      setRole('student');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-3">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
            <Icon name="person_add" className="text-primary" />
            Add New User
          </h3>
          <button onClick={onClose} className="text-secondary hover:text-on-surface">
            <Icon name="close" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-error border border-error/20 rounded-lg text-body-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Ama"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Boateng"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ama.boateng@gmail.com"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">Department</label>
              <select
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">Initial Password</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          <p className="font-label-xs text-label-xs text-secondary italic">
            An 8-digit unique institutional Index Number will be generated automatically upon creation.
          </p>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Creating User...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedDeptId, setSelectedDeptId] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load available departments
  useEffect(() => {
    api
      .getDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]));
  }, []);

  // Load users with filters
  async function loadUsers() {
    try {
      const data = await api.getUsers({
        departmentId: selectedDeptId,
        role: selectedRole,
      });
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [selectedDeptId, selectedRole]);

  async function handleDeactivate(id, name) {
    if (!confirm(`Are you sure you want to deactivate ${name}?`)) return;
    try {
      await api.deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppLayout>
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={loadUsers}
        departments={departments}
        coordinatorDeptId={user?.departmentId}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface font-bold">User Management</h2>
          <p className="font-body-base text-body-base text-secondary mt-1">
            Manage student, supervisor, and coordinator accounts across university departments.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
        >
          <Icon name="person_add" />
          Add New User
        </button>
      </div>

      {/* Filter Toolbar: Department & Role Filters */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Icon name="domain" className="text-secondary" />
            <span className="font-label-md text-label-md text-on-surface font-medium">Department:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface text-body-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Icon name="badge" className="text-secondary" />
            <span className="font-label-md text-label-md text-on-surface font-medium">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface text-body-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="student">Students Only</option>
              <option value="supervisor">Supervisors Only</option>
              <option value="coordinator">Coordinators Only</option>
            </select>
          </div>
        </div>

        <div className="text-body-sm text-secondary font-medium">
          Total Users: <strong className="text-on-surface">{users.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading users…</p>
        </div>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Index No.</th>
                  <th className="py-3.5 px-6 font-semibold">Full Name</th>
                  <th className="py-3.5 px-6 font-semibold">Email</th>
                  <th className="py-3.5 px-6 font-semibold">Role</th>
                  <th className="py-3.5 px-6 font-semibold">Department</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-on-surface divide-y divide-outline-variant/40">
                {users.map((u) => {
                  const fullName = `${u.firstName} ${u.lastName}`;
                  return (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-on-surface">
                        #{u.indexNumber ?? '—'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-xs font-bold">
                            {initials(fullName)}
                          </div>
                          <span className="font-semibold text-on-surface">{fullName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-secondary">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs px-2.5 py-1 rounded-full border border-outline-variant capitalize font-semibold">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-secondary">
                        {u.department?.name ?? 'Assigned'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeactivate(u.id, fullName)}
                          className="px-3 py-1.5 rounded-lg border border-error/30 text-error hover:bg-error-container/20 font-label-xs text-label-xs transition-colors cursor-pointer"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-secondary">
                      No users match the selected Department and Role filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
