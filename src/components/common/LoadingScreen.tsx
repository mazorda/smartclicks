import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  message?: string;
}

export default function LoadingScreen({ message }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" className="mb-4" />
      {message && (
        <p className="text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
}