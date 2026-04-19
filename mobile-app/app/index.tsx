import React from 'react';
import { View } from 'react-native';

import { EmptyState } from '@/components/primitives/EmptyState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { LoadingState } from '@/components/primitives/LoadingState';
import { AppButton } from '@/components/primitives/AppButton';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppSection } from '@/components/primitives/AppSection';
import { AppText } from '@/components/primitives/AppText';
import { useAppTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { toggleTheme } = useAppTheme();

  return (
    <AppScreen scroll padded>
      <View className="gap-8 pb-8 pt-8">
        <View className="flex-row items-center justify-between">
          <AppText variant="displayMD">Step 5</AppText>
          <AppButton variant="tertiary" size="sm" onPress={toggleTheme}>
            Toggle theme
          </AppButton>
        </View>

        <AppSection title="Loading">
          <LoadingState label="Fetching places…" />
        </AppSection>

        <AppSection title="Error">
          <ErrorState message="Could not load places. Check your connection." onRetry={() => {}} />
        </AppSection>

        <AppSection title="Empty">
          <EmptyState
            title="No places found"
            message="Try adjusting your filters or search in a different area."
            action={{ label: 'Clear filters', onPress: () => {} }}
          />
        </AppSection>
      </View>
    </AppScreen>
  );
}
