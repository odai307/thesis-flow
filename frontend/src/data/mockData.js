// Static demo data for the ThesisFlow frontend.
// Replace these with real API calls (from the Express backend) later.

export const currentUser = {
  id: 'u-ama',
  firstName: 'Ama',
  lastName: 'Boateng',
  email: 'ama.boateng@thesisflow.dev',
  role: 'student', // 'student' | 'supervisor' | 'coordinator'
  department: 'Computer Science',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDJgmvYa0kZeF6RHnUSroaBg0csjWEG-ymdrw7bXU_CZTRXQgYWPjnnX_lUrC-2WPxqJogsYniM-AAZ2-IpixkKcvCsJ76CGMoc9f2_brc4lgaHHPKiNKMK1KzNfD7o-cSv_wMwED5t4UyZ8llVzly9BD_eeybh8SZjD1RBNQKmw0B-kePeKvL0R3hRNP29H-2W4sza40GrmexYqDd8xNwaFXVJmicn389Fr8LHHDZuKBP7EwjGhoqh',
};

export const thesis = {
  id: 't-1',
  title: 'Exploring Neural Architectures for Sustainable Edge Computing',
  status: 'revisions_requested', // draft | submitted | under_review | revisions_requested | approved
  versionNumber: 3,
  supervisor: 'Dr. Sarah Jenkins',
  progress: 65,
  targetDefense: 'Fall 2024',
  pendingComments: 4,
};

export const activities = [
  {
    id: 1,
    icon: 'rate_review',
    iconClass: 'bg-surface-container-highest text-on-surface-variant',
    html: '<strong>Dr. Sarah Jenkins</strong> added a comment on <strong>v3</strong>',
    detail:
      '"Please expand on the methodologies used in section 4.2 to clarify the dataset normalization process."',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: 'assignment_return',
    iconClass: 'bg-error-container text-on-error-container',
    html: 'Status changed to <strong class="text-error font-medium">Revisions Requested</strong>',
    time: 'Yesterday at 4:30 PM',
  },
  {
    id: 3,
    icon: 'upload_file',
    iconClass: 'bg-primary-container text-on-primary',
    html: 'You uploaded <strong class="font-medium">v3: "Exploring Neural Architectures..."</strong>',
    time: 'Oct 12, 2023 at 10:15 AM',
  },
];

export const committee = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins',
    role: 'Primary Supervisor',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpIiExTizojxbnPvlJNciXuseLUyxdH669ciAqGae8euTwvnzdRmMEXgzBNL3WZAFOD56S6s4ZsEF4hH72op37QFUpgzB3HFeJOLvIQxbDfpw3a0lXl673faGZOwQ3AuMEnLxw4zG815WNTlWKGO5HCMGss13NOopnHazhEFT-hNl9zhAAGhU1xgXN6L9dX4yJDuRfEHLdY_MpZ1L9cOD8NDrefnHjtWKDP-wOguYr3KyJGmuztiJm',
  },
  {
    id: 2,
    name: 'Dr. Robert Chen',
    role: 'Co-Supervisor',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBG0QWHR9ZiFICCjHHkzWU49vqV4W8_ZeSxSuuupfmmFmSCKMX7KxTZjk_luEAkzPW_LbBu00VD8MpAdx-o3WjQJdkYcNkD1H70GHZZ4_9tfXxxqqqcq4jnieHnAaQ6DFQKNzdL6TUP9GrmkIvcVhlbV_PHdPx0lnSNrUYhXvRpL-HwhAdZuKBzxU_MzN4mXuKdvDEbkA6ccQZH4keRYKwyhKUsNcV-G5dlWWioJg8t__6alxxEt0jd',
  },
];

export const deadlines = [
  { id: 1, label: 'Revision v4 Due', date: 'Nov 15, 2023 (In 12 days)', urgent: true },
  { id: 2, label: 'Final Submission', date: 'Dec 10, 2023', urgent: false },
];

export const comments = [
  {
    id: 1,
    author: 'Dr. Sarah Jenkins',
    role: 'supervisor',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpIiExTizojxbnPvlJNciXuseLUyxdH669ciAqGae8euTwvnzdRmMEXgzBNL3WZAFOD56S6s4ZsEF4hH72op37QFUpgzB3HFeJOLvIQxbDfpw3a0lXl673faGZOwQ3AuMEnLxw4zG815WNTlWKGO5HCMGss13NOopnHazhEFT-hNl9zhAAGhU1xgXN6L9dX4yJDuRfEHLdY_MpZ1L9cOD8NDrefnHjtWKDP-wOguYr3KyJGmuztiJm',
    text: 'Please expand on the methodologies used in section 4.2 to clarify the dataset normalization process.',
    time: '2 hours ago',
  },
];

export const submissions = [
  { id: 1, version: 3, status: 'revisions_requested', date: 'Oct 12, 2023', file: 'thesis-v3.pdf' },
  { id: 2, version: 2, status: 'approved', date: 'Sep 28, 2023', file: 'thesis-v2.pdf' },
  { id: 3, version: 1, status: 'approved', date: 'Sep 10, 2023', file: 'thesis-v1.pdf' },
];

export const notifications = [
  {
    id: 1,
    type: 'comment',
    title: 'New comment from Dr. Sarah Jenkins',
    body: 'Please expand on the methodologies used in section 4.2...',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'status_change',
    title: 'Status changed to Revisions Requested',
    body: 'Your thesis v3 requires revisions before approval.',
    time: 'Yesterday at 4:30 PM',
    read: false,
  },
  {
    id: 3,
    type: 'status_change',
    title: 'Submission v2 approved',
    body: 'Dr. Sarah Jenkins approved your v2 submission.',
    time: 'Sep 28, 2023',
    read: true,
  },
];

export const supervisorTheses = [
  {
    id: 't-1',
    student: 'Ama Boateng',
    title: 'Exploring Neural Architectures for Sustainable Edge Computing',
    status: 'revisions_requested',
    lastUpdated: 'Yesterday',
    versions: 3,
  },
  {
    id: 't-2',
    student: 'Kwesi Mensah',
    title: 'Blockchain-Based Supply Chain Transparency',
    status: 'under_review',
    lastUpdated: '2 days ago',
    versions: 2,
  },
  {
    id: 't-3',
    student: 'Efua Owusu',
    title: 'Machine Learning for Early Crop Disease Detection',
    status: 'submitted',
    lastUpdated: '3 days ago',
    versions: 1,
  },
  {
    id: 't-4',
    student: 'Yaw Asante',
    title: 'Quantum-Resistant Cryptography in IoT',
    status: 'approved',
    lastUpdated: '1 week ago',
    versions: 4,
  },
];

export const coordinatorStats = {
  totalTheses: 42,
  byStatus: { draft: 5, submitted: 8, under_review: 12, revisions_requested: 9, approved: 8 },
  overdueReviews: 4,
};

export const allUsers = [
  { id: 1, name: 'Ama Boateng', email: 'ama.boateng@thesisflow.dev', role: 'student', department: 'Computer Science', status: 'active' },
  { id: 2, name: 'Kwame Osei', email: 'kwame.osei@thesisflow.dev', role: 'supervisor', department: 'Computer Science', status: 'active' },
  { id: 3, name: 'Diana Mensah', email: 'diana.mensah@thesisflow.dev', role: 'coordinator', department: 'Computer Science', status: 'active' },
  { id: 4, name: 'Kwesi Mensah', email: 'kwesi.mensah@thesisflow.dev', role: 'student', department: 'Mathematics', status: 'active' },
  { id: 5, name: 'Efua Owusu', email: 'efua.owusu@thesisflow.dev', role: 'student', department: 'Computer Science', status: 'deactivated' },
];

export const departments = [
  { id: 1, name: 'Computer Science', coordinator: 'Diana Mensah', members: 28 },
  { id: 2, name: 'Mathematics', coordinator: 'Prof. Yaa Agyemang', members: 19 },
];

// Department-wide thesis progress for the Coordinator Reports page.
export const departmentReports = [
  { label: 'Draft', value: 5 },
  { label: 'Submitted', value: 8 },
  { label: 'Under Review', value: 12 },
  { label: 'Revisions', value: 9 },
  { label: 'Approved', value: 8 },
];
