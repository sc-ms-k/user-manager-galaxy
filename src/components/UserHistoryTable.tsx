import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserHistoryTableProps {
  user: User;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function UserHistoryTable({ user, isLoading }: UserHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock history data - replace this with actual history data from your backend
  const history = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      action: index % 2 === 0 ? 'increase' : 'decrease',
      quantity: index % 2 === 0 ? 1 : -1,
      newTotal: user.quantity - index
    }));
  }, [user.quantity]);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHistory = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50 text-sm text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium">Action</th>
              <th className="px-6 py-3 text-left font-medium">Change</th>
              <th className="px-6 py-3 text-left font-medium">New Total</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y">
            {paginatedHistory.map((entry) => (
              <tr key={entry.id} className="transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">
                    {format(entry.date, 'MMM d, yyyy HH:mm')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    entry.action === 'increase' 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {entry.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "font-medium",
                    entry.quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{entry.newTotal}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 