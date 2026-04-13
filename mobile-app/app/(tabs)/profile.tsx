import {
  IconBell,
  IconBookmarkFilled,
  IconCircleCheck,
  IconEdit,
  IconHelpCircle,
  IconLock,
  IconMapPin,
  IconMoon,
  IconPalette,
  IconPencil,
  IconUserCircle,
} from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingRow } from '@/components/profile/SettingRow';
import { StatCard } from '@/components/profile/StatCard';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const primary = useThemeColor({}, 'primary');

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Header: Avatar & Info ─────────────────────────────────────── */}
        <View className="items-center px-5 pb-6 pt-10">
          <View className="relative mb-4">
            <View className="h-28 w-28 items-center justify-center rounded-full border-4 border-primary bg-surface-container-highest">
              <IconUserCircle size={64} color={onSurfaceVariant} strokeWidth={1} />
            </View>
            <View className="border-surface-container-lowest absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-4 bg-primary">
              <IconEdit size={14} color={onPrimary} strokeWidth={2.5} />
            </View>
          </View>

          <Text className="text-headline-sm font-display font-bold text-on-surface">Alex Chen</Text>
          <Text className="text-body-md mt-1 font-body text-on-surface-variant">
            Explorer since 2024
          </Text>

          <Pressable className="mt-5 flex-row items-center gap-2 rounded-full bg-surface-container-high px-6 py-2.5">
            <IconPencil size={16} color={primary} />
            <Text className="text-label-lg font-body font-medium text-on-surface">
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <View className="flex-row gap-4 px-5 pb-8">
          <StatCard value={42} label="Places" />
          <StatCard value={16} label="Reviews" />
          <StatCard value={89} label="Saved" />
        </View>

        {/* ── Activity Cards (Horizontal) ───────────────────────────────── */}
        <View className="pb-8">
          <View className="px-5">
            <SectionHeader title="Your Activity" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 20, paddingTop: 12 }}
          >
            {[
              { id: '1', title: 'Visit History', icon: IconCircleCheck, count: '12 this month' },
              { id: '2', title: 'Your Reviews', icon: IconPencil, count: '3 pending' },
              { id: '3', title: 'Collections', icon: IconBookmarkFilled, count: '5 curated' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.id}
                  className="border-outline-variant/10 h-40 w-40 justify-between rounded-3xl border bg-surface-container-low p-5"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest">
                    <Icon size={20} color={primary} />
                  </View>
                  <View>
                    <Text className="font-display text-title-md font-bold text-on-surface">
                      {item.title}
                    </Text>
                    <Text className="mt-1 font-body text-body-sm text-on-surface-variant">
                      {item.count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Preferences ───────────────────────────────────────────────── */}
        <View className="px-5 pb-8">
          <SectionHeader title="Preferences" />
          <View className="border-outline-variant/10 bg-surface-container-lowest mt-4 rounded-3xl border px-4 py-2">
            <SettingRow icon={IconPalette} label="Categories" />
            <View className="bg-outline-variant/10 h-px w-full" />
            <SettingRow icon={IconMapPin} label="Location Settings" />
            <View className="bg-outline-variant/10 h-px w-full" />
            <SettingRow icon={IconBell} label="Notifications" showChevron={false} />
          </View>
        </View>

        {/* ── App Settings ──────────────────────────────────────────────── */}
        <View className="px-5 pb-8">
          <SectionHeader title="App Settings" />
          <View className="border-outline-variant/10 bg-surface-container-lowest mt-4 rounded-3xl border px-4 py-2">
            <SettingRow icon={IconUserCircle} label="Account" />
            <View className="bg-outline-variant/10 h-px w-full" />

            <SettingRow icon={IconLock} label="Privacy & Security" />
            <View className="bg-outline-variant/10 h-px w-full" />

            <SettingRow
              icon={IconMoon}
              label="Theme"
              showChevron={false}
              rightElement={<ThemeToggle />}
            />
            <View className="bg-outline-variant/10 h-px w-full" />

            <SettingRow icon={IconHelpCircle} label="Help & Support" />
          </View>
        </View>

        {/* ── Log Out CTA ───────────────────────────────────────────────── */}
        <View className="items-center px-5 pb-8">
          <Pressable className="py-4">
            <Text className="text-label-lg font-body font-bold uppercase tracking-widest text-error">
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
