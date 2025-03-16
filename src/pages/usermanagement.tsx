import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, ArrowLeft, Plus, Minus, History } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import UserHistoryTable from '@/components/UserHistoryTable';

const UserManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [action, setAction] = useState<'increase' | 'decrease' | null>(null);
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);

  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetUser($id: ID!) {
              user(id: $id) {
                id
                name
                birthday
                quantity
                avatar
              }
            }
          `,
          variables: { id },
        }),
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      return result.data.user;
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async (variables: { id: string; quantity: number }) => {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation UpdateUserQuantity($id: ID!, $quantity: Int!) {
              updateUserQuantity(id: $id, quantity: $quantity) {
                id
                quantity
              }
            }
          `,
          variables,
        }),
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      return result.data.updateUserQuantity;
    },
    onSuccess: () => {
      toast.success(`Quantity ${action === 'increase' ? 'increased' : 'decreased'} successfully`);
      setIsQuantityModalOpen(false);
      navigate('/index');
    },
    onError: (error) => {
      toast.error('Failed to update quantity', {
        description: error.message,
      });
    },
  });

  // Update birthday mutation
  const updateBirthdayMutation = useMutation({
    mutationFn: async (variables: { id: string; birthday: string }) => {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation UpdateUserBirthday($id: ID!, $birthday: String!) {
              updateUserBirthday(id: $id, birthday: $birthday) {
                id
                birthday
              }
            }
          `,
          variables,
        }),
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      return result.data.updateUserBirthday;
    },
    onSuccess: () => {
      toast.success('Birthday updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update birthday', {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (userData?.birthday) {
      setBirthdate(new Date(userData.birthday));
    }
  }, [userData]);

  const handleQuantityAction = (actionType: 'increase' | 'decrease') => {
    setAction(actionType);
    setIsQuantityModalOpen(true);
  };

  const handleQuantityConfirm = () => {
    if (!userData?.id || !action) return;
    
    const newQuantity = action === 'increase' 
      ? userData.quantity + 1 
      : Math.max(0, userData.quantity - 1);

    updateQuantityMutation.mutate({
      id: userData.id.toString(),
      quantity: newQuantity,
    });
  };

  const handleBirthdayUpdate = (date: Date | undefined) => {
    if (!date || !userData?.id) return;
    
    updateBirthdayMutation.mutate({
      id: userData.id.toString(),
      birthday: date.toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Header with back button */}
      <div className="max-w-2xl mx-auto mb-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/index')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* User Profile Card */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 bg-primary/5 border-b">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className='text-2xl font-medium leading-none tracking-tight mb-5'>User Management</h1>
              <UserAvatar
                name={userData?.name || ''}
                size="lg"
                imageUrl={userData?.avatar}
                className="h-24 w-24"
              />
              <div>
                <h1 className="text-2xl font-semibold">{userData?.name}</h1>
                <p className="text-muted-foreground">User Profile</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Birthday Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium block">Birthday</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !birthdate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary/70" />
                    {birthdate ? format(birthdate, "MMMM d, yyyy") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthdate}
                    onSelect={(date) => {
                      setBirthdate(date);
                      handleBirthdayUpdate(date);
                    }}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Quantity Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium block">Quantity</label>
              <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {userData?.quantity}
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handleQuantityAction('decrease')}
                    variant="outline"
                    className="h-12 w-12"
                    disabled={userData?.quantity === 0}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => handleQuantityAction('increase')}
                    variant="outline"
                    className="h-12 w-12"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData?.quantity < 5 ? (
                    <span className="text-red-500">Low quantity warning</span>
                  ) : (
                    <span className="text-green-500">Quantity is good</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-primary/70" />
                <h2 className="text-xl font-semibold">Quantity History</h2>
              </div>
            </div>
            <UserHistoryTable user={userData} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Quantity Update Modal */}
      <Dialog open={isQuantityModalOpen} onOpenChange={setIsQuantityModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Quantity Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {action} the quantity for {userData?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsQuantityModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuantityConfirm}
              disabled={updateQuantityMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateQuantityMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Yes, Continue'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
