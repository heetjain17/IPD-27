import { FlashList } from '@shopify/flash-list';
import { IconMapPin, IconMapPinOff, IconX } from '@tabler/icons-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

import { FilterChipGroup } from '@/components/composed/FilterChipGroup';
import { PlaceCard } from '@/components/composed/PlaceCard';
import { SearchBar } from '@/components/composed/SearchBar';
import { AppText } from '@/components/primitives/AppText';
import { AppScreen } from '@/components/primitives/AppScreen';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { LoadingState } from '@/components/primitives/LoadingState';
import { useFilters, usePlaces } from '@/hooks/usePlaces';
import type { Place, PlacesSortKey } from '@/types/api';

export function ExploreScreen() {
  const router = useRouter();

  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationBannerDismissed, setLocationBannerDismissed] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function getLocation() {
      if (process.env.EXPO_PUBLIC_MOCK_LOCATION) {
        setCoords({ lat: 19.076, lng: 72.8777 });
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationDenied(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    }
    void getLocation();
  }, []);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaces({
    q: debouncedSearch || undefined,
    category: category ?? undefined,
    sort: (coords ? 'distance' : 'priority') as PlacesSortKey,
    lat: coords?.lat,
    lng: coords?.lng,
    radius: coords ? 25000 : undefined,
  });

  const { data: filters } = useFilters();

  const places = data?.pages.flatMap((page) => page.places) ?? [];

  const LocationBanner = locationDenied && !locationBannerDismissed && (
    <Pressable
      onPress={() => void Linking.openSettings()}
      className="mx-4 flex-row items-center gap-3 rounded-roundedness-md px-4 py-3 active:opacity-75"
      style={{
        backgroundColor: palette.surfaceRaised,
        borderWidth: 1,
        borderColor: palette.outline,
      }}
    >
      <IconMapPinOff size={16} color={palette.onSurfaceMuted} />
      <AppText variant="bodySM" color="muted" className="flex-1">
        Location off — results sorted by popularity. Tap to enable.
      </AppText>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          setLocationBannerDismissed(true);
        }}
        hitSlop={8}
      >
        <IconX size={14} color={palette.onSurfaceMuted} />
      </Pressable>
    </Pressable>
  );

  const ListHeader = (
    <View className="gap-3 pb-2 pt-4">
      <View className="px-4">
        <SearchBar value={search} onChangeText={setSearch} />
      </View>
      {LocationBanner}
      {(filters?.categories?.length ?? 0) > 0 && (
        <FilterChipGroup options={filters!.categories} selected={category} onSelect={setCategory} />
      )}
    </View>
  );

  const ListEmpty = isPending ? (
    <LoadingState fullScreen label="Finding places…" />
  ) : isError ? (
    <ErrorState
      title="Couldn't load places"
      message={(error as Error | null)?.message ?? 'Something went wrong'}
      onRetry={() => void refetch()}
    />
  ) : (
    <EmptyState
      icon={IconMapPin}
      title="No places found"
      message="Try adjusting your search or filters."
    />
  );

  return (
    <AppScreen padded={false} edges={['top']}>
      <FlashList<Place>
        data={places}
        renderItem={({ item }) => (
          <View className="px-4 pb-3">
            <PlaceCard place={item} onPress={() => router.push(`/(tabs)/explore/${item.id}`)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <LoadingState />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
        showsVerticalScrollIndicator={false}
      />
    </AppScreen>
  );
}
