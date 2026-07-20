// Role-based sidebar navigation. Maps to the real ThesisFlow pages from the
// project spec (NOT Stitch's invented labels). Icons use Material Symbols.

export const navByRole = {
  student: [
    { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { label: 'Thesis Workspace', icon: 'article', to: '/thesis/:id/workspace' },
    { label: 'Version History', icon: 'history', to: '/thesis/:id/version-history' },
    { label: 'Notifications', icon: 'notifications', to: '/notifications', badge: true },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ],
  supervisor: [
    { label: 'Dashboard', icon: 'dashboard', to: '/supervisor' },
    { label: 'Thesis Review', icon: 'rate_review', to: '/review/:id' },
    { label: 'Notifications', icon: 'notifications', to: '/notifications', badge: true },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ],
  coordinator: [
    { label: 'Dashboard', icon: 'dashboard', to: '/coordinator' },
    { label: 'User Management', icon: 'group', to: '/users' },
    { label: 'Department Management', icon: 'account_tree', to: '/departments' },
    { label: 'Reports', icon: 'insights', to: '/reports' },
    { label: 'Notifications', icon: 'notifications', to: '/notifications', badge: true },
    { label: 'Profile', icon: 'person', to: '/profile' },
  ],
};
