import { IconChevronRight, IconClock, IconSearch, IconX } from '@tabler/icons-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppSearchBar } from '@/components/shared/AppSearchBar';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { SectionHeader } from '@/components/shared/SectionHeader';

// ─── Screen ───────────────────────────────────────────────────────────────────

import { useThemeColor } from '@/hooks/use-theme-color';

// ─── Data ─────────────────────────────────────────────────────────────────────

const RECENT_SEARCHES = ['Noir Kitchen', 'Rooftop bars', 'Coffee near me'];
const TRENDING_SEARCHES = ['Art Galleries', 'Live Music', 'Parks with trails'];

const CATEGORIES = [
  { id: '1', title: 'Food & Drink', color: 'bg-primary', textColor: 'text-on-primary' },
  {
    id: '2',
    title: 'Arts & Culture',
    color: 'bg-surface-container-highest',
    textColor: 'text-on-surface',
  },
  {
    id: '3',
    title: 'Outdoors',
    color: 'bg-surface-container-highest',
    textColor: 'text-on-surface',
  },
  { id: '4', title: 'Nightlife', color: 'bg-primary', textColor: 'text-on-primary' },
  {
    id: '5',
    title: 'Shopping',
    color: 'bg-surface-container-highest',
    textColor: 'text-on-surface',
  },
  { id: '6', title: 'Events', color: 'bg-surface-container-highest', textColor: 'text-on-surface' },
];

const SUGGESTIONS = [
  { id: '1', text: 'Coffee Shops', match: 'Coffe', highlight: true },
  { id: '2', text: 'Coffee Roasters', match: 'Coffe' },
  { id: '3', text: 'Coffee & Tea', match: 'Coffe' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const isSearching = query.length > 0;

  const primary = useThemeColor({}, 'primary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <ScreenWrapper>
      <View className="px-5 pb-4 pt-4">
        <AppSearchBar
          placeholder="Where to?"
          value={query}
          onChangeText={setQuery}
          variant="solid"
          notification={false}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isSearching ? (
          // ─── Autocomplete Suggestions ──────────────────────────────────
          <View className="px-5 pb-6 pt-2">
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s.id}
                className={`border-outline-variant/20 flex-row items-center gap-3 border-b py-4 ${
                  s.highlight ? 'border-l-2 border-l-primary pl-3' : ''
                }`}
              >
                <IconSearch size={18} color={onSurfaceVariant} />
                <Text className="flex-1 font-body text-body-lg text-on-surface">
                  <Text className="font-bold text-primary">{s.match}</Text>
                  {s.text.replace(s.match, '')}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          // ─── Default Discovery State ───────────────────────────────────
          <View className="pb-8">
            {/* Recent Searches */}
            <View className="mb-8 px-5">
              <SectionHeader title="Recent Searches" />
              <View className="mt-2">
                {RECENT_SEARCHES.map((r, i) => (
                  <View key={i} className="flex-row items-center justify-between py-3">
                    <View className="flex-row items-center gap-3">
                      <IconClock size={16} color={onSurfaceVariant} />
                      <Text className="text-body-md font-body text-on-surface-variant">{r}</Text>
                    </View>
                    <Pressable hitSlop={10}>
                      <IconX size={16} color={outlineVariant} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>

            {/* Trending */}
            <View className="mb-8 px-5">
              <SectionHeader title="Trending Currently" />
              <View className="border-outline-variant/10 mt-2 rounded-xl border bg-surface-container-low px-4 py-2">
                {TRENDING_SEARCHES.map((t, i) => (
                  <Pressable
                    key={i}
                    className={`flex-row items-center justify-between py-3 ${
                      i !== TRENDING_SEARCHES.length - 1 ? 'border-outline-variant/10 border-b' : ''
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <IconSearch size={16} color={primary} />
                      <Text className="text-body-md font-body font-semibold text-on-surface">
                        {t}
                      </Text>
                    </View>
                    <IconChevronRight size={16} color={onSurfaceVariant} />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Explore by Category Grid */}
            <View className="px-5 pb-6">
              <SectionHeader title="Explore by Category" />
              <View className="mt-3 flex-row flex-wrap justify-between gap-y-3">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    className={`h-24 w-[48%] justify-end rounded-2xl p-4 ${cat.color} border-outline-variant/10 border`}
                  >
                    <Text className={`text-title-sm font-display font-medium ${cat.textColor}`}>
                      {cat.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
