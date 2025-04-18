
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, UserRound, X, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { toast } from 'sonner';
import UserAvatar from './UserAvatar';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const AddUserModal = ({ isOpen, onClose, onSave, isLoading }: AddUserModalProps) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!birthdate) {
      toast.error('Please select a birthdate');
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        birthdate: birthdate.toISOString(),
        quantity: Number(quantity),
        avatar: avatar.trim()
      });
      
      // Reset form
      setName('');
      setBirthdate(undefined);
      setQuantity(1);
      setAvatar('');
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image is too large', {
        description: 'Please select an image smaller than 2MB'
      });
      return;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file'
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-card rounded-xl shadow-xl border animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Add New User</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div 
              className="relative cursor-pointer group"
              onClick={handleAvatarClick}
            >
              <UserAvatar 
                name={name} 
                size="lg" 
                className="mb-3"
                imageUrl={avatar} 
              />
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {avatar ? 'Click to change' : 'Click to upload avatar'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <div className="relative rounded-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  placeholder="Enter user name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 input-transition"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="birthdate" className="text-sm font-medium">
                Birthdate
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthdate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthdate ? format(birthdate, "MMMM d, yyyy") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthdate}
                    onSelect={setBirthdate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="input-transition"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-card flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              'Save User'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
