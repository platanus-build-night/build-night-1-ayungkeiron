
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

interface EventFormSkeletonProps {
  onBack: () => void;
}

export const EventFormSkeleton = ({ onBack }: EventFormSkeletonProps) => {
  return (
    <div className="max-w-md mx-auto pb-16">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>
      
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-6" />
      </div>
      
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};
