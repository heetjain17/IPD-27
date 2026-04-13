import { IconChevronRight, IconCompass, IconMapPin } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  title: string;
  subtitle: string;
  badge?: string;
  location?: string;
  onPress?: () => void;
};

/**
 * Full-height hero discovery card with placeholder image,
 * badge chip, title, location, and lime arrow FAB.
 */
export function HeroCard({ title, subtitle, badge = 'Trending Nearby', location, onPress }: Props) {
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View className="mx-5 mb-8 h-80 overflow-hidden rounded-roundedness-lg">
      {/* Placeholder image fill */}
      <View className="absolute inset-0 items-center justify-center bg-surface-container-high">
        <IconCompass size={44} color={outlineVariant} strokeWidth={1} />
        <Text className="mt-2 font-body text-body-sm text-outline">Featured Image</Text>
      </View>

      {/* Dark scrim */}
      <View className="bg-surface-container-lowest/60 absolute inset-0" />

      {/* Top badge */}
      <View className="absolute left-5 top-5">
        <Text className="overflow-hidden rounded-roundedness-full border border-white/10 bg-white/10 px-4 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface">
          {badge}
        </Text>
      </View>

      {/* Bottom content */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-end justify-between p-5">
        <View className="mr-4 flex-1">
          <Text
            className="font-display text-[2rem] font-bold leading-tight text-on-surface"
            numberOfLines={2}
          >
            {title}
          </Text>
          {location && (
            <View className="mt-2 flex-row items-center gap-1">
              <IconMapPin size={13} color={onSurfaceVariant} strokeWidth={1.8} />
              <Text className="font-body text-body-sm text-on-surface-variant">{location}</Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={onPress}
          className="w-13 h-13 items-center justify-center rounded-roundedness-full bg-primary"
          style={{ width: 52, height: 52 }}
        >
          <IconChevronRight size={22} color={onPrimary} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
