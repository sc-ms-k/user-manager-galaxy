
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UserTable from '@/components/UserTable';
import AddUserModal from '@/components/AddUserModal';
import { fetchUsers, createUser } from '@/lib/api';
import { User } from '@/types';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Fetch users
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  
  // Handle loading state
  useEffect(() => {
    if (error) {
      toast.error('Failed to load users', {
        description: 'Please check your connection and try again.',
      });
    }
  }, [error]);
  
  // Handle saving a new user
  const handleSaveUser = async (user: Omit<User, 'id'>) => {
    setIsCreating(true);
    try {
      const response = await createUser(user);
      
      if (response.success) {
        toast.success('User added successfully');
        setIsModalOpen(false);
        refetch(); // Refresh the user list
      } else {
        toast.error('Failed to add user', {
          description: response.error || 'An unexpected error occurred',
        });
      }
    } catch (error) {
      toast.error('Failed to add user', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background p-6 md:p-10">
      <div className="max-w-5xl w-full mx-auto space-y-10">
        <header className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-medium leading-none tracking-tight">User Management</h1>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </div>
          <div className="h-px bg-border w-full" />
        </header>

        <main className="space-y-6 animate-fade-in">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-6">Users</h2>
              <UserTable
                users={data?.data || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        isLoading={isCreating}
      />
    </div>
  );
};

export default Index;
