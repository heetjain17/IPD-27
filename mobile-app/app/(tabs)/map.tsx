import {
  IconBookmark,
  IconCalendarEvent,
  IconMap2,
  IconToolsKitchen2,
  IconTree,
} from '@tabler/icons-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { MapSearchBar } from '@/components/map/MapSearchBar';
import { NearbySheet } from '@/components/map/NearbySheet';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';

import { useThemeColor } from '@/hooks/use-theme-color';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FILTER_CHIPS = [
  { label: 'All' },
  { label: 'Food', icon: IconToolsKitchen2 },
  { label: 'Nature', icon: IconTree },
  { label: 'Events', icon: IconCalendarEvent },
  { label: 'Saved', icon: IconBookmark },
];

const NEARBY_PLACES = [
  {
    title: 'Noir Kitchen',
    subtitle: 'East Side',
    tag: 'Fine Dining',
    rating: 4.9,
    distance: '0.4 mi',
    price: '$$$',
  },
  {
    title: 'Highland Grove',
    subtitle: 'Upper West Park',
    tag: 'Nature',
    rating: 4.7,
    distance: '2.1 mi',
  },
  {
    title: 'The Vault Bar',
    subtitle: 'Arts District',
    tag: 'Cocktail Bar',
    rating: 4.8,
    distance: '0.9 mi',
    price: '$$',
  },
  {
    title: 'Sky Terrace',
    subtitle: 'Rooftop, Level 32',
    tag: 'Rooftop',
    rating: 4.5,
    distance: '1.5 mi',
    price: '$$$',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MapScreen() {
  const [activeChip, setActiveChip] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <ScreenWrapper>
      <View className="bg-surface-container-lowest flex-1">
        {/* ── Map placeholder ──────────────────────────────────────────────── */}
        <View className="absolute inset-0 items-center justify-center bg-surface-container-low">
          {/* Faint grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={`h${i}`}
              className="absolute left-0 right-0 h-px bg-outline-variant opacity-10"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={`v${i}`}
              className="absolute bottom-0 top-0 w-px bg-outline-variant opacity-10"
              style={{ left: `${(i + 1) * 16.66}%` }}
            />
          ))}

          {/* Placeholder label */}
          <View className="items-center gap-3 opacity-30">
            <IconMap2 size={52} color={onSurfaceVariant} strokeWidth={1} />
            <Text className="font-body text-body-sm text-on-surface-variant">
              Map view · integrate react-native-maps
            </Text>
          </View>

          {/* Decorative place pins */}
          <View
            className="border-surface-container-lowest absolute h-5 w-5 rounded-roundedness-full border-2 bg-primary"
            style={{ top: '35%', left: '28%' }}
          />
          <View
            className="border-surface-container-lowest absolute h-5 w-5 rounded-roundedness-full border-2 bg-primary"
            style={{ top: '55%', left: '62%' }}
          />
          <View
            className="border-surface-container-lowest absolute h-6 w-6 rounded-roundedness-full border-2 bg-primary"
            style={{ top: '43%', left: '44%' }}
          />
          <View
            className="absolute h-3 w-3 rounded-roundedness-full bg-outline-variant"
            style={{ top: '28%', left: '70%' }}
          />
          <View
            className="absolute h-3 w-3 rounded-roundedness-full bg-outline-variant"
            style={{ top: '65%', left: '22%' }}
          />
        </View>

        {/* ── Floating search bar + chips (above map) ───────────────────────── */}
        <MapSearchBar
          chips={FILTER_CHIPS}
          activeChipIndex={activeChip}
          onChipPress={setActiveChip}
        />

        {/* ── Draggable bottom sheet ────────────────────────────────────────── */}
        <NearbySheet places={NEARBY_PLACES} viewMode={viewMode} onViewModeChange={setViewMode} />
      </View>
    </ScreenWrapper>
  );
}
