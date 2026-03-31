import { IconAdjustmentsHorizontal, IconBell, IconSearch } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  /** Input placeholder */
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  /** Called when the filter icon is tapped */
  onFilterPress?: () => void;
  /**
   * Show the notification bell on the right.
   * Pass `true` to show without a dot, or `{ unread: true }` to show the lime dot.
   */
  notification?: boolean | { unread: boolean };
  onNotificationPress?: () => void;
  /**
   * `solid`  — opaque surface card background (Discover, Search screens)
   * `glass`  — semi-transparent dark bg for floating over a map/image
   */
  variant?: 'solid' | 'glass';
};

const GLASS_BG = 'rgba(25,26,26,0.85)';

export function AppSearchBar({
  placeholder = 'Search places, experiences…',
  value,
  onChangeText,
  onFilterPress,
  notification,
  onNotificationPress,
  variant = 'solid',
}: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const isGlass = variant === 'glass';
  const showBell = notification !== undefined && notification !== false;
  const showDot = typeof notification === 'object' ? notification.unread : false;

  // Pill background
  const pillBg = isGlass
    ? GLASS_BG
    : isDark
      ? undefined // uses NativeWind class
      : undefined;

  const pillClass = isGlass
    ? 'flex-row items-center gap-3 rounded-roundedness-full border border-outline-variant/20 px-4 py-3'
    : isDark
      ? 'flex-row items-center gap-3 rounded-roundedness-full border border-outline-variant/20 bg-surface-container-highest px-4 py-3'
      : 'flex-row items-center gap-3 rounded-roundedness-full border border-light-outline-variant/40 bg-light-surface-container-highest px-4 py-3';

  const bellClass = isGlass
    ? 'h-11 w-11 items-center justify-center rounded-roundedness-full border border-outline-variant/20'
    : isDark
      ? 'h-11 w-11 items-center justify-center rounded-roundedness-full border border-outline-variant/20 bg-surface-container-highest'
      : 'h-11 w-11 items-center justify-center rounded-roundedness-full border border-light-outline-variant/40 bg-light-surface-container-highest';

  return (
    <View className="flex-row items-center gap-3">
      {/* Search pill */}
      <View
        className={`flex-1 ${pillClass}`}
        style={isGlass ? { backgroundColor: pillBg } : undefined}
      >
        <IconSearch size={17} color="#adaaaa" strokeWidth={1.8} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#767575"
          className={`flex-1 font-body text-sm ${
            isDark ? 'text-on-surface' : 'text-light-on-surface'
          }`}
          returnKeyType="search"
        />

        {/* Divider + filter */}
        <View className="flex-row items-center gap-3">
          <View
            className={`h-5 w-px ${isDark ? 'bg-outline-variant' : 'bg-light-outline-variant'}`}
          />
          <Pressable onPress={onFilterPress} hitSlop={8}>
            <IconAdjustmentsHorizontal size={16} color="#d7fd4e" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Optional notification bell */}
      {showBell && (
        <Pressable
          onPress={onNotificationPress}
          className={bellClass}
          style={isGlass ? { backgroundColor: GLASS_BG } : undefined}
          hitSlop={4}
        >
          <View className="relative">
            <IconBell size={19} color="#adaaaa" strokeWidth={1.8} />
            {showDot && (
              <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </View>
        </Pressable>
      )}
    </View>
  );
}
