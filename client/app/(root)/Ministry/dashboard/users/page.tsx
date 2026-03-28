import type { Metadata } from 'next';
import UserManagementPage from '@/components/Ministry/users/UserManagementClient';

export const metadata: Metadata = {
  title:       'User Management | Ministry of Agriculture',
  description: 'Review and manage farmer, buyer, and transporter registration requests',
};

export default function UsersRoute() {
  return <UserManagementPage />;
}