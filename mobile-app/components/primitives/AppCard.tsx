import React from 'react';
import { Pressable, View } from 'react-native';

interface AppCardProps {
  onPress?: () => void;
  children: React.ReactNode;
  elevated?: boolean;
  className?: string;
}

export function AppCard({ onPress, children, elevated = false, className = '' }: AppCardProps) {
  const bgClass = elevated ? 'bg-surface' : 'bg-surface-raised';
  const base = `${bgClass} rounded-roundedness-md ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        className={base}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={base}>{children}</View>;
}
