import { IconBookmarkFilled, IconPlus } from '@tabler/icons-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PlaceCard } from '@/components/shared/PlaceCard';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { SectionHeader } from '@/components/shared/SectionHeader';

// ─── Screen ───────────────────────────────────────────────────────────────────

import { useThemeColor } from '@/hooks/use-theme-color';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = ['Saved', 'Collections', 'Trips', 'Recent'];

const COLLECTIONS = [
  { id: '1', title: 'Weekend Getaways', count: 12, bgColor: 'bg-[#4d5f00]' },
  { id: '2', title: 'Coffee Shops', count: 8, bgColor: 'bg-surface-container-highest' },
  { id: '3', title: 'Museums', count: 5, bgColor: 'bg-surface-container-highest' },
];

const SAVED_PLACES = [
  { title: 'The Vault Bar', subtitle: 'Arts District', tag: 'Cocktail Bar', rating: 4.8 },
  { title: 'Highland Grove', subtitle: 'Upper West Park', tag: 'Nature', rating: 4.7 },
  { title: 'Noir Kitchen', subtitle: 'East Side', tag: 'Fine Dining', rating: 4.9 },
];

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState(0);

  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');

  return (
    <ScreenWrapper>
      {/* ── Main Scroll View ────────────────────────────────────────────── */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickyHeaderIndices={[1]}
      >
        {/* 0. Header (Scrolls away) */}
        <View className="px-5 pb-2 pt-4">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-headline-sm font-display font-bold text-on-surface">
              Your Space
            </Text>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest">
              <IconPlus size={20} color={primary} />
            </Pressable>
          </View>
        </View>

        {/* 1. Segment Tabs (Sticky context) */}
        <View className="bg-surface-container-lowest px-5 pb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 24 }}
          >
            {TABS.map((tab, i) => {
              const active = activeTab === i;
              return (
                <Pressable key={tab} onPress={() => setActiveTab(i)} className="relative py-2">
                  <Text
                    className={`text-body-md font-body font-bold tracking-wide ${
                      active ? 'text-on-surface' : 'text-on-surface-variant'
                    }`}
                  >
                    {tab}
                  </Text>
                  {active && (
                    <View className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. Collections (Horizontal inside vertical) */}
        <View className="pb-8">
          <View className="px-5">
            <SectionHeader title="Curated Collections" onSeeAll={() => {}} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 16 }}
          >
            {COLLECTIONS.map((c) => (
              <Pressable
                key={c.id}
                className={`border-outline-variant/10 h-52 w-40 justify-between rounded-3xl border p-4 ${c.bgColor}`}
              >
                <View className="h-8 w-8 items-center justify-center rounded-full bg-black/20">
                  <IconBookmarkFilled size={14} color={onSurface} />
                </View>
                <View>
                  <Text className="font-display text-title-md font-bold text-white shadow-sm">
                    {c.title}
                  </Text>
                  <Text className="text-label-md mt-1 font-body text-white/80">
                    {c.count} places
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 3. Individual Saves (Vertical List continuation) */}
        <View className="px-5">
          <SectionHeader title="All Saved Places" />
          <View className="mt-4 gap-4">
            {SAVED_PLACES.map((p) => (
              <PlaceCard key={p.title} {...p} variant="feed" onBookmark={() => {}} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Floating CTA ────────────────────────────────────────────────── */}
      <View className="absolute bottom-6 left-5 right-5">
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-roundedness-full bg-primary py-4 shadow-sm"
          style={{ shadowColor: primary, shadowOpacity: 0.2, shadowRadius: 10 }}
        >
          <IconPlus size={20} color={onPrimary} strokeWidth={2.5} />
          <Text className="text-label-lg font-body font-bold uppercase tracking-widest text-on-primary">
            New Collection
          </Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}
