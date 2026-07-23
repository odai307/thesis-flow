import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Profile() {
  const { user, login } = useAuth(); // Auth context

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const data = await api.updateProfile({ firstName, lastName, email });
      // Update local state / refresh auth context
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      window.location.reload(); // Reload to refresh user context
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setChangingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setChangingPassword(false);
    }
  }

  if (!user) return null;

  return (
    <AppLayout>
      <header className="mb-6">
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Account & Profile Settings</h2>
        <p className="font-body-base text-body-base text-secondary mt-1">
          View your institutional account details, edit profile info, and change your password.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <section className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary font-bold text-headline-md flex items-center justify-center mb-4 shadow-sm">
            {(user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')}
          </div>

          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            {user.firstName} {user.lastName}
          </h3>
          <span className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs px-3 py-1 rounded-full border border-outline-variant mt-2 capitalize font-semibold">
            {user.role}
          </span>

          <div className="w-full border-t border-outline-variant my-6" />

          <div className="w-full flex flex-col gap-4 text-left">
            <div>
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider font-semibold block mb-0.5">
                Institutional Index Number
              </span>
              <span className="font-mono font-bold text-on-surface text-body-base">
                #{user.indexNumber ?? 'N/A'}
              </span>
            </div>

            <div>
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider font-semibold block mb-0.5">
                Email Address
              </span>
              <span className="font-body-base text-body-base text-on-surface">
                {user.email}
              </span>
            </div>

            <div>
              <span className="font-label-xs text-label-xs text-secondary uppercase tracking-wider font-semibold block mb-0.5">
                Department
              </span>
              <span className="font-body-base text-body-base text-on-surface">
                {user.department?.name ?? 'Assigned Department'}
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Forms for Edit Profile & Change Password */}
        <section className="lg:col-span-2 flex flex-col gap-8">
          {/* Edit Profile Form */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-section-header text-section-header text-on-surface mb-4 flex items-center gap-2">
              <Icon name="person" className="text-primary" />
              Edit Personal Information
            </h3>

            {profileMsg.text && (
              <div
                className={`p-3.5 rounded-lg mb-4 text-body-sm font-body-sm ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-error-container text-error border border-error/20'
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-section-header text-section-header text-on-surface mb-4 flex items-center gap-2">
              <Icon name="lock" className="text-primary" />
              Change Account Password
            </h3>

            {passwordMsg.text && (
              <div
                className={`p-3.5 rounded-lg mb-4 text-body-sm font-body-sm ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-error-container text-error border border-error/20'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {changingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
