import { useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/types';
import UserAvatar from './UserAvatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

const UserTable = ({ 
  users, 
  isLoading, 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems 
}: UserTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  if (isLoading) {
    return <UserTableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50 text-sm text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Avatar</th>
              <th className="px-6 py-3 text-left font-medium">User Name</th>
              <th className="px-6 py-3 text-left font-medium">Birthday</th>
              <th className="px-6 py-3 text-left font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No users found. Add a new user to get started.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  className="table-row-animate hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(user.id!)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        name={user.name}
                        size="sm"
                        imageUrl={user.avatar}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {format(new Date(user.birthdate), 'MMMM d, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10",
                      user.quantity < 5 ? "text-red-600 dark:text-red-400" : "text-primary"
                    )}>
                      {user.quantity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * (totalItems / totalPages) + 1} to {Math.min(currentPage * (totalItems / totalPages), totalItems)} of {totalItems} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
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
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-5 w-24" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-5 w-32" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-5 w-12" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
