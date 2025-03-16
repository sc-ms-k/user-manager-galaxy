import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
}

const UserAvatar = ({ name, className, size = 'md', imageUrl }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Size maps
  const sizesMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  // Create initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate a consistent color based on name
  const getColorClass = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-amber-100 text-amber-600',
      'bg-rose-100 text-rose-600',
      'bg-indigo-100 text-indigo-600',
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // If we have a valid image URL and no error loading it, use Avatar component
  if (imageUrl && !imageError) {
    return (
      <Avatar className={cn(sizesMap[size], className)}>
        <AvatarImage 
          src={imageUrl} 
          alt={name || 'User avatar'}
          onError={() => setImageError(true)}
        />
        <AvatarFallback className={name ? getColorClass(name) : 'bg-secondary'}>
          {name ? getInitials(name) : <UserRound className={cn(
            "text-foreground/80",
            size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'
          )} />}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Otherwise, fall back to the original implementation
  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center text-sm font-medium overflow-hidden transition-all',
        sizesMap[size],
        !name ? 'bg-secondary' : getColorClass(name),
        className
      )}
    >
      {name ? (
        <span className="animate-fade-in">{getInitials(name)}</span>
      ) : (
        <UserRound 
          className={cn(
            "text-foreground/80",
            size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'
          )} 
        />
      )}
    </div>
  );
};

export default UserAvatar;
