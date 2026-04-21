import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { IconCurrentLocation } from '@tabler/icons-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterChipGroup } from '@/components/composed/FilterChipGroup';
import { PlaceCard } from '@/components/composed/PlaceCard';
import { PlaceCardSkeleton } from '@/components/composed/PlaceCardSkeleton';
import { AppText } from '@/components/primitives/AppText';
import { Colors, type AppColors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useFilters, usePlaces } from '@/hooks/usePlaces';
import type { Place } from '@/types/api';

const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

const INITIAL_REGION: Region = {
  latitude: 19.076,
  longitude: 72.8777,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

const SEARCH_THRESHOLD = 0.012;


export function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];
  const { top } = useSafeAreaInsets();

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const sheetAnimatedPosition = useSharedValue(0);
  const locatedOnce = useRef(false);

  const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [visibleRegion, setVisibleRegion] = useState<Region | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const snapPoints = useMemo(() => ['38%', '72%'], []);

  const locateBtnAnimStyle = useAnimatedStyle(() => ({
    // animatedPosition.value = Y from top of screen where sheet handle sits.
    // Position button 12px above the handle (handle ~28px tall, so -40px from sheet Y).
    top: sheetAnimatedPosition.value - 56,
  }));

  useEffect(() => {
    async function getLocation() {
      if (process.env.EXPO_PUBLIC_MOCK_LOCATION === 'true') {
        const mock = { lat: 19.1061292, lng: 72.8257094 };
        setSearchCoords(mock);
        return;
      }
      try {
        const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          if (!canAskAgain) {
            Alert.alert(
              'Location Access Denied',
              'Please enable location permissions in your device settings to see places near you.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          }
          return;
        }

        const providerStatus = await Location.getProviderStatusAsync();
        if (!providerStatus.locationServicesEnabled) {
          Alert.alert(
            'Location Disabled',
            'Please turn on your device GPS to find places nearby.',
            [{ text: 'OK', style: 'cancel' }]
          );
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const c = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        setSearchCoords(c);
      } catch (e) {
        console.warn('Location access failed:', e);
      }
    }
    void getLocation();
  }, []);

  useEffect(() => {
    if (!searchCoords || locatedOnce.current) return;
    locatedOnce.current = true;
    mapRef.current?.animateToRegion(
      {
        latitude: searchCoords.lat,
        longitude: searchCoords.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      900,
    );
  }, [searchCoords]);

  const handleLocateMe = useCallback(() => {
    if (!searchCoords) return;
    mapRef.current?.animateToRegion(
      {
        latitude: searchCoords.lat,
        longitude: searchCoords.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      600,
    );
  }, [searchCoords]);

  const { data: filtersData } = useFilters();
  const categories = filtersData?.categories ?? [];

  const { data, isPending } = usePlaces({
    lat: searchCoords?.lat,
    lng: searchCoords?.lng,
    sort: searchCoords ? 'distance' : 'priority',
    radius: searchCoords ? 5000 : undefined,
    category: category ?? undefined,
  });

  const places = useMemo(() => data?.pages.flatMap((p) => p.places) ?? [], [data]);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedId) ?? null,
    [places, selectedId],
  );

  const showSearchHere = useMemo(() => {
    if (!visibleRegion || !searchCoords) return false;
    return (
      Math.abs(visibleRegion.latitude - searchCoords.lat) > SEARCH_THRESHOLD ||
      Math.abs(visibleRegion.longitude - searchCoords.lng) > SEARCH_THRESHOLD
    );
  }, [visibleRegion, searchCoords]);

  const handleMarkerPress = useCallback((place: Place) => {
    setSelectedId(place.id);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const handleSearchHere = useCallback(() => {
    if (visibleRegion) {
      setSearchCoords({ lat: visibleRegion.latitude, lng: visibleRegion.longitude });
    }
  }, [visibleRegion]);

  const handlePlacePress = useCallback(
    (id: string) => router.push(`/(tabs)/place/${id}` as never),
    [router],
  );

  const listData: Place[] = selectedPlace ? [selectedPlace] : places;

  const initialRegion: Region = searchCoords
    ? {
        latitude: searchCoords.lat,
        longitude: searchCoords.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
    : INITIAL_REGION;

  return (
    <View style={styles.container}>
      {/* Full-screen map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={setVisibleRegion}
        customMapStyle={colorScheme === 'dark' ? MAP_DARK_STYLE : []}
      >
        {/* Place markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            pinColor={selectedId === place.id ? palette.primaryStrong : palette.primary}
            onPress={() => handleMarkerPress(place)}
          />
        ))}
        {/* User location — red pin */}
        {searchCoords && (
          <Marker
            coordinate={{ latitude: searchCoords.lat, longitude: searchCoords.lng }}
            pinColor="red"
            anchor={{ x: 0.5, y: 1 }}
            zIndex={999}
          />
        )}
      </MapView>

      {/* Category chips overlay */}
      {categories.length > 0 && (
        <View style={[styles.chipsOverlay, { top: top + 10 }]} pointerEvents="box-none">
          <FilterChipGroup
            options={['All', ...categories]}
            selected={category ?? 'All'}
            onSelect={(v) => setCategory(v === 'All' ? null : v)}
          />
        </View>
      )}

      {/* Locate-me button */}
      {searchCoords && (
        <Animated.View style={[styles.locateBtn, { backgroundColor: palette.surface }, locateBtnAnimStyle]}>
          <Pressable onPress={handleLocateMe} style={styles.locateBtnPressable}>
            <IconCurrentLocation size={20} color={palette.primary} />
          </Pressable>
        </Animated.View>
      )}

      {/* Search this area button */}
      {showSearchHere && (
        <View
          style={[styles.searchHereWrapper, { top: top + (categories.length > 0 ? 60 : 18) }]}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={handleSearchHere}
            style={[styles.searchHereBtn, { backgroundColor: palette.surface }]}
          >
            <AppText variant="bodySM">Search this area</AppText>
          </Pressable>
        </View>
      )}

      {/* Bottom sheet */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={0}
        enableDynamicSizing={false}
        animatedPosition={sheetAnimatedPosition}
        backgroundStyle={{ backgroundColor: palette.surface }}
        handleIndicatorStyle={{ backgroundColor: palette.onSurfaceMuted, width: 40 }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.listContent}>
          {isPending ? (
            <View style={styles.skeletons}>
              <PlaceCardSkeleton />
              <PlaceCardSkeleton />
            </View>
          ) : (
            <>
              {selectedPlace ? (
                <Pressable onPress={() => setSelectedId(null)} style={styles.backRow}>
                  <AppText variant="bodySM" color="muted">
                    ← All places
                  </AppText>
                </Pressable>
              ) : places.length > 0 ? (
                <AppText variant="bodySM" color="muted" style={styles.nearbyLabel}>
                  {places.length} places nearby
                </AppText>
              ) : (
                <AppText variant="bodySM" color="muted" style={styles.emptyText}>
                  No places found in this area
                </AppText>
              )}
              {listData.map((place) => (
                <View key={place.id} style={styles.cardRow}>
                  <PlaceCard place={place} onPress={() => handlePlacePress(place.id)} />
                </View>
              ))}
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chipsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  searchHereWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  searchHereBtn: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  skeletons: {
    gap: 12,
  },
  backRow: {
    paddingBottom: 10,
  },
  nearbyLabel: {
    paddingBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    paddingTop: 32,
  },
  cardRow: {
    marginBottom: 12,
  },
  locateBtn: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  locateBtnPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
