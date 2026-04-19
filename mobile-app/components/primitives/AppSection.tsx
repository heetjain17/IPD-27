import React from 'react';
import { View } from 'react-native';

import { AppText } from './AppText';

interface AppSectionProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function AppSection({ title, children, action, className = '' }: AppSectionProps) {
  return (
    <View className={`gap-3 ${className}`}>
      {(title || action) && (
        <View className="flex-row items-center justify-between">
          {title && <AppText variant="titleMD">{title}</AppText>}
          {action && <View>{action}</View>}
        </View>
      )}
      {children}
    </View>
  );
}
