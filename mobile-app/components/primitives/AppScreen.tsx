import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface AppScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  className?: string;
}

export function AppScreen({
  children,
  scroll = false,
  padded = true,
  edges,
  className = '',
}: AppScreenProps) {
  const paddingClass = padded ? 'px-4' : '';

  if (scroll) {
    return (
      <SafeAreaView edges={edges} className={`flex-1 bg-background ${className}`}>
        <ScrollView
          className="flex-1"
          contentContainerClassName={`${paddingClass} pb-6`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} className={`flex-1 bg-background ${className}`}>
      <View className={`flex-1 ${paddingClass}`}>{children}</View>
    </SafeAreaView>
  );
}
