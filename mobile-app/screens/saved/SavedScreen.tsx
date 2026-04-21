import { FlashList } from '@shopify/flash-list';
import { IconBookmarkOff, IconBookmarks } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { PlaceCard } from '@/components/composed/PlaceCard';
import { PlaceCardSkeleton } from '@/components/composed/PlaceCardSkeleton';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useSavedPlaces, useUnsavePlace } from '@/hooks/usePlaces';
import type { Place } from '@/types/api';

export function SavedScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const { data, isPending, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage } =
    useSavedPlaces();

  const { mutate: unsave } = useUnsavePlace();

  const places = useMemo(() => data?.pages.flatMap((p) => p.places) ?? [], [data]);

  const handlePress = useCallback(
    (id: string) => router.push(`/(tabs)/place/${id}` as never),
    [router],
  );

  const handleUnsave = useCallback((placeId: string) => unsave(placeId), [unsave]);

  if (isPending) {
    return (
      <AppScreen padded={false} edges={['top']}>
        <View className="px-4 pt-4">
          <AppText variant="titleLG" className="mb-4">
            Saved
          </AppText>
        </View>
        <View className="gap-3 px-4">
          <PlaceCardSkeleton />
          <PlaceCardSkeleton />
          <PlaceCardSkeleton />
        </View>
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen edges={['top']}>
        <AppText variant="titleLG" className="mb-4">
          Saved
        </AppText>
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false} edges={['top']}>
      <FlashList<Place>
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
        onEndReached={() => hasNextPage && void fetchNextPage()}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View className="px-4 pb-3 pt-4">
            <AppText variant="titleLG">Saved</AppText>
            {places.length > 0 && (
              <AppText variant="bodySM" color="muted">
                {places.length} place{places.length !== 1 ? 's' : ''}
              </AppText>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={IconBookmarks}
            title="No saved places yet"
            message="Tap the bookmark on any place to save it here."
            action={{
              label: 'Explore places',
              onPress: () => router.push('/(tabs)/search' as never),
            }}
            fullScreen
          />
        }
        renderItem={({ item }) => (
          <View className="px-4 pb-3">
            <View style={{ position: 'relative' }}>
              <PlaceCard place={item} onPress={() => handlePress(item.id)} />
              <Pressable
                onPress={() => handleUnsave(item.id)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: palette.surface,
                  borderRadius: 20,
                  padding: 6,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 1 },
                }}
                hitSlop={8}
              >
                <IconBookmarkOff size={18} color={palette.onSurfaceMuted} />
              </Pressable>
            </View>
          </View>
        )}
      />
    </AppScreen>
  );
}
