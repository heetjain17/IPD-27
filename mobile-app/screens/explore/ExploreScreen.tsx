import { FlashList } from '@shopify/flash-list';
import { IconAdjustments, IconMapPin, IconMapPinOff, IconX } from '@tabler/icons-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

import { FilterChipGroup } from '@/components/composed/FilterChipGroup';
import { FiltersSheet, type FiltersValue } from '@/components/composed/FiltersSheet';
import { PlaceCard } from '@/components/composed/PlaceCard';
import { SearchBar } from '@/components/composed/SearchBar';
import { AppText } from '@/components/primitives/AppText';
import { AppScreen } from '@/components/primitives/AppScreen';
import { PlaceCardSkeleton } from '@/components/composed/PlaceCardSkeleton';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { useFilters, usePlaces } from '@/hooks/usePlaces';
import type { Place, PlacesSortKey } from '@/types/api';

export function ExploreScreen() {
  const router = useRouter();

  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const filtersSheetRef = useRef<BottomSheetModal>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationBannerDismissed, setLocationBannerDismissed] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters_value, setFiltersValue] = useState<FiltersValue>({
    sort: 'distance',
    category: null,
    area: null,
  });

  const category = filters_value.category;
  const area = filters_value.area;

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

  const effectiveSort: PlacesSortKey =
    filters_value.sort === 'distance' && !coords ? 'priority' : filters_value.sort;

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
    area: area ?? undefined,
    sort: effectiveSort,
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

  const hasActiveFilters =
    filters_value.category !== null ||
    filters_value.area !== null ||
    filters_value.sort !== 'distance';

  const ListHeader = (
    <View className="gap-3 pb-2 pt-4">
      <View className="flex-row items-center gap-2 px-4">
        <View className="flex-1">
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <Pressable
          onPress={() => filtersSheetRef.current?.present()}
          className="h-11 w-11 items-center justify-center rounded-roundedness-full active:opacity-70"
          style={{
            backgroundColor: hasActiveFilters ? palette.primary : palette.surfaceRaised,
            borderWidth: 1.5,
            borderColor: hasActiveFilters ? palette.primary : palette.outline,
          }}
        >
          <IconAdjustments size={18} color={hasActiveFilters ? '#fff' : palette.onSurfaceMuted} />
        </Pressable>
      </View>
      {LocationBanner}
      {(filters?.categories?.length ?? 0) > 0 && (
        <FilterChipGroup
          options={['All', ...filters!.categories]}
          selected={category ?? 'All'}
          onSelect={(v) => setFiltersValue((s) => ({ ...s, category: v === 'All' ? null : v }))}
        />
      )}
    </View>
  );

  const ListEmpty = isPending ? (
    <View className="gap-3 px-4 pt-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </View>
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
            <PlaceCard place={item} onPress={() => router.push(`/(tabs)/place/${item.id}`)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="gap-3 px-4 py-3">
              <PlaceCardSkeleton />
              <PlaceCardSkeleton />
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
      <FiltersSheet ref={filtersSheetRef} value={filters_value} onApply={setFiltersValue} />
    </AppScreen>
  );
}
