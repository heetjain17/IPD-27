import { IconAdjustmentsHorizontal, IconBell, IconSearch } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  onNotificationPress?: () => void;
};

/**
 * Styled search bar for the Discover screen.
 * Pill-shaped input + filter icon on right edge + notification bell.
 */
export function DiscoverSearchBar({
  value,
  onChangeText,
  onFilterPress,
  onNotificationPress,
}: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={`flex-row items-center gap-3 px-5 pb-3 pt-4 ${
        isDark ? 'bg-surface' : 'bg-light-surface'
      }`}
    >
      {/* Search pill */}
      <View
        className={`flex-1 flex-row items-center gap-3 rounded-roundedness-full border px-4 py-3 ${
          isDark
            ? 'border-outline-variant/20 bg-surface-container-highest'
            : 'border-light-outline-variant/40 bg-light-surface-container-highest'
        }`}
      >
        <IconSearch size={17} color="#adaaaa" strokeWidth={1.8} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search places, experiences…"
          placeholderTextColor="#767575"
          className={`flex-1 font-body text-sm ${
            isDark ? 'text-on-surface' : 'text-light-on-surface'
          }`}
          returnKeyType="search"
        />

        {/* Divider + filter icon */}
        <View className="flex-row items-center gap-3">
          <View
            className={`h-5 w-px ${isDark ? 'bg-outline-variant' : 'bg-light-outline-variant'}`}
          />
          <Pressable onPress={onFilterPress} hitSlop={8}>
            <IconAdjustmentsHorizontal size={16} color="#d7fd4e" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Notification bell */}
      <Pressable
        onPress={onNotificationPress}
        className={`h-11 w-11 items-center justify-center rounded-roundedness-full border ${
          isDark
            ? 'border-outline-variant/20 bg-surface-container-highest'
            : 'border-light-outline-variant/40 bg-light-surface-container-highest'
        }`}
        hitSlop={4}
      >
        {/* Unread dot */}
        <View className="relative">
          <IconBell size={19} color="#adaaaa" strokeWidth={1.8} />
          <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
        </View>
      </Pressable>
    </View>
  );
}
