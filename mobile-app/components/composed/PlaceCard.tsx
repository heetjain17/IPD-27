import { IconMapPin } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { AppCard } from '@/components/primitives/AppCard';
import { AppChip } from '@/components/primitives/AppChip';
import { AppText } from '@/components/primitives/AppText';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { RatingRow } from './RatingRow';
import type { Place } from '@/types/api';

interface PlaceCardProps {
  place: Place;
  onPress?: () => void;
}

function formatDistance(meters?: number): string | null {
  if (meters == null) return null;
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

export function PlaceCard({ place, onPress }: PlaceCardProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const thumbnail = place.thumbnail ?? place.media[0]?.url ?? null;
  const distance = formatDistance(place.distance);
  const visibleTags = place.tags.slice(0, 3);

  return (
    <AppCard onPress={onPress}>
      <View className="flex-row gap-3 p-2">
        {/* Thumbnail */}
        <View className="h-28 w-24 overflow-hidden rounded-[1.115rem] bg-surface-subtle">
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <IconMapPin size={28} color={palette.onSurfaceMuted} />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 justify-between gap-1 py-1 pr-1">
          <View className="gap-0.5">
            <AppText variant="titleMD" numberOfLines={1}>
              {place.name}
            </AppText>
            <AppText variant="bodySM" color="muted" numberOfLines={1}>
              {place.category}
              {distance ? `  ·  ${distance}` : ''}
            </AppText>
          </View>

          <RatingRow rating={place.averageRating} count={place.reviewCount} size="sm" />

          {/* Tags */}
          {visibleTags.length > 0 && (
            <View className="flex-row flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <AppChip key={tag} label={tag} size="sm" />
              ))}
            </View>
          )}
        </View>
      </View>
    </AppCard>
  );
}
