import { IconMapPin, IconStar } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type PlaceCardVariant = 'feed' | 'compact';

type Props = {
  title: string;
  subtitle: string;
  tag?: string;
  rating?: number;
  distance?: string;
  price?: string;
  variant?: PlaceCardVariant;
  onBookmark?: () => void;
};

/**
 * Reusable place card.
 * - `feed`: full-width aspect-video with image placeholder + content below
 * - `compact`: fixed w-72 h-44 for horizontal scrolling lists
 */
export function PlaceCard({
  title,
  subtitle,
  tag,
  rating,
  distance,
  price,
  variant = 'feed',
  onBookmark,
}: Props) {
  const isCompact = variant === 'compact';

  return (
    <View
      className={`overflow-hidden rounded-roundedness-md bg-surface-container-low ${
        isCompact ? 'w-72' : 'w-full'
      }`}
    >
      {/* Image placeholder */}
      <View className={`relative bg-surface-container-high ${isCompact ? 'h-44' : 'aspect-video'}`}>
        {/* Tag badge */}
        {tag && (
          <View className="absolute bottom-3 left-3">
            <Text className="overflow-hidden rounded-roundedness-full bg-black/50 px-3 py-1 font-body text-label-sm font-bold uppercase tracking-widest text-on-surface">
              {tag}
            </Text>
          </View>
        )}

        {/* Bookmark button */}
        {onBookmark && (
          <Pressable
            onPress={onBookmark}
            className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-roundedness-full bg-black/40"
          >
            <IconMapPin size={16} color="#ffffff" />
          </Pressable>
        )}

        {/* Gradient overlay */}
        <View className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="mb-2 flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text
              className="font-display text-title-md font-bold text-on-surface"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="mt-0.5 font-body text-body-sm text-on-surface-variant"
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          </View>
          {rating && (
            <View className="flex-row items-center gap-1 rounded bg-primary/10 px-2 py-1">
              <IconStar size={12} color="#d7fd4e" fill="#d7fd4e" />
              <Text className="font-body text-label-sm font-bold text-primary">{rating}</Text>
            </View>
          )}
        </View>

        {/* Meta row */}
        {(distance || price) && (
          <View className="flex-row items-center gap-4">
            {distance && (
              <View className="flex-row items-center gap-1">
                <IconMapPin size={14} color="#adaaaa" />
                <Text className="font-body text-body-sm text-on-surface-variant">{distance}</Text>
              </View>
            )}
            {price && (
              <Text className="font-body text-body-sm text-on-surface-variant">{price}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
