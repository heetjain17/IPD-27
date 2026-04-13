import { IconList, IconMap2 } from '@tabler/icons-react-native';
import React, { useRef } from 'react';
import { Animated, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';

import { PlaceCard } from '@/components/shared/PlaceCard';
import { useThemeColor } from '@/hooks/use-theme-color';

// Snap positions from the bottom of the screen
const SNAP_PEEK = 220; // collapsed — shows header + 1 card
const SNAP_OPEN = 440; // expanded

type Place = {
  title: string;
  subtitle: string;
  tag?: string;
  rating?: number;
  distance?: string;
  price?: string;
};

type Props = {
  places: Place[];
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
};

export function NearbySheet({ places, viewMode, onViewModeChange }: Props) {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');

  const EXPANSION = SNAP_OPEN - SNAP_PEEK;

  // Current snapped position (0 = peek, -EXPANSION = open)
  const currentSnap = useRef(0);
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        translateY.setValue(currentSnap.current);
      },
      onPanResponderMove: (_, g) => {
        // Add drag delta to the snapped base, clamp within bounds
        const next = currentSnap.current + g.dy;
        translateY.setValue(Math.max(-EXPANSION, Math.min(0, next)));
      },
      onPanResponderRelease: (_, g) => {
        const finalY = currentSnap.current + g.dy;
        // Past midpoint → open, otherwise → peek
        const snapTo = finalY < -(EXPANSION / 2) ? -EXPANSION : 0;
        currentSnap.current = snapTo;
        Animated.spring(translateY, {
          toValue: snapTo,
          useNativeDriver: false,
          bounciness: 4,
        }).start();
      },
    }),
  ).current;

  const sheetHeight = translateY.interpolate({
    inputRange: [-EXPANSION, 0],
    outputRange: [SNAP_OPEN, SNAP_PEEK],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(14,14,14,0.97)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderTopWidth: 1,
          borderColor: 'rgba(72,72,72,0.25)',
          height: sheetHeight,
          overflow: 'hidden',
        },
      ]}
    >
      {/* Drag zone — handle bar + full header row */}
      <View {...panResponder.panHandlers}>
        {/* Handle bar */}
        <View className="items-center pb-2 pt-3">
          <View className="h-1 w-10 rounded-full bg-outline-variant" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-4">
          <View>
            <Text className="font-display text-title-md font-bold text-on-surface">
              Nearby Places
            </Text>
            <Text className="mt-0.5 font-body text-body-sm text-on-surface-variant">
              {places.length} spots within 5 mi
            </Text>
          </View>

          {/* Map / List toggle */}
          <View className="flex-row items-center rounded-roundedness-full bg-surface-container-highest p-1">
            {(['map', 'list'] as const).map((mode) => {
              const active = viewMode === mode;
              const Icon = mode === 'map' ? IconMap2 : IconList;
              return (
                <Pressable
                  key={mode}
                  onPress={() => onViewModeChange(mode)}
                  className={`flex-row items-center gap-1.5 rounded-roundedness-full px-3 py-1.5 ${active ? 'bg-primary' : ''}`}
                >
                  <Icon size={14} color={active ? onPrimary : onSurfaceVariant} strokeWidth={2} />
                  <Text
                    className={`font-body text-[10px] font-bold uppercase tracking-widest ${
                      active ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {mode}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Cards */}
      {viewMode === 'map' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }}
        >
          {places.map((p) => (
            <PlaceCard key={p.title} {...p} variant="compact" />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        >
          {places.map((p) => (
            <PlaceCard key={p.title} {...p} variant="feed" />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}
