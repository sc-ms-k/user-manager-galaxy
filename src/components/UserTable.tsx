
import { useMemo } from 'react';
import { format } from 'date-fns';
import { User } from '@/types';
import UserAvatar from './UserAvatar';
import { Skeleton } from '@/components/ui/skeleton';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
}

const UserTable = ({ users, isLoading }: UserTableProps) => {
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  if (isLoading) {
    return <UserTableSkeleton />;
  }

  return (
    <div className="w-full rounded-lg border overflow-hidden animate-fade-in">
      <table className="w-full">
        <thead className="bg-secondary/50 text-sm text-muted-foreground">
          <tr>
            <th className="px-6 py-3 text-left font-medium">User</th>
            <th className="px-6 py-3 text-left font-medium">Birthday</th>
            <th className="px-6 py-3 text-left font-medium">Quantity</th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y">
          {sortedUsers.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                No users found. Add a new user to get started.
              </td>
            </tr>
          ) : (
            sortedUsers.map((user) => (
              <tr key={user.id} className="table-row-animate">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <UserAvatar 
                      name={user.name} 
                      size="sm" 
                      imageUrl={user.avatar}
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.quantity}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const UserTableSkeleton = () => {
  return (
    <div className="w-full rounded-lg border animate-pulse">
      <table className="w-full">
        <thead className="bg-secondary/50">
          <tr>
            <th className="px-6 py-3 text-left">
              <Skeleton className="h-5 w-16" />
            </th>
            <th className="px-6 py-3 text-left">
              <Skeleton className="h-5 w-20" />
            </th>
            <th className="px-6 py-3 text-left">
              <Skeleton className="h-5 w-16" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y">
          {[1, 2, 3].map((index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-5 w-32" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-5 w-12 rounded-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
