import { createAvatar } from '@dicebear/core';
import { botttsNeutral, initials } from '@dicebear/collection';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: 'botttsNeutral' | 'initials';
}

const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({ seed, className, variant }) => {
  const avatar =
    variant === 'botttsNeutral'
      ? createAvatar(botttsNeutral, { seed })
      : createAvatar(initials, {
          seed,
          backgroundColor: ['b6e3f4'],
          fontSize: 42,
        });

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Generated avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default GeneratedAvatar;
