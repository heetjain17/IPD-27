import {
  IconCalendarEvent,
  IconCompass,
  IconDotsCircleHorizontal,
  IconToolsKitchen2,
  IconTree,
} from '@tabler/icons-react-native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryRow } from '@/components/discover/CategoryRow';
import { DiscoverSearchBar } from '@/components/discover/DiscoverSearchBar';
import { FeedTabs } from '@/components/discover/FeedTabs';
import { HeroCard } from '@/components/discover/HeroCard';
import { LocationChips } from '@/components/discover/LocationChips';
import { PlaceCard } from '@/components/shared/PlaceCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useAppTheme } from '@/context/ThemeContext';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Places', icon: IconCompass },
  { label: 'Food', icon: IconToolsKitchen2 },
  { label: 'Events', icon: IconCalendarEvent },
  { label: 'Nature', icon: IconTree },
  { label: 'More', icon: IconDotsCircleHorizontal },
];

const LOCATIONS = ['San Francisco', 'Boutique Stays', 'Paris', 'Dubai', 'Agra'];

const FEED_TABS = ['Recommended', 'Nearby', 'Trending'];

const FEED_ITEMS = [
  {
    title: 'Noir Kitchen',
    subtitle: 'East Side Neighborhood',
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
    subtitle: 'Downtown Arts District',
    tag: 'Cocktail Bar',
    rating: 4.8,
    distance: '0.9 mi',
    price: '$$',
  },
  {
    title: 'Lumiere Coffee',
    subtitle: 'Cafe & Workspace',
    tag: 'Café',
    rating: 4.6,
    distance: '1.2 mi',
    price: '$',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DiscoverScreen() {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeFeedTab, setActiveFeedTab] = useState(0);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-surface-container-lowest' : 'bg-light-surface-lowest'}`}
      edges={['top']}
    >
      {/* Sticky search bar */}
      <DiscoverSearchBar />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Category icon row */}
        <CategoryRow
          categories={CATEGORIES}
          activeIndex={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Featured hero card */}
        <HeroCard
          title="The Concrete Vault"
          subtitle="Downtown Arts District"
          location="Downtown Arts District, 1.2 mi"
          badge="Trending Nearby"
          onPress={() => {}}
        />

        {/* Where to explore next */}
        <View className="mb-6 px-5">
          <SectionHeader
            title="Where to Explore Next"
            subtitle="Based on your recent activity"
            onSeeAll={() => {}}
          />
          <LocationChips locations={LOCATIONS} />
        </View>

        {/* Feed tabs + list */}
        <FeedTabs tabs={FEED_TABS} activeIndex={activeFeedTab} onSelect={setActiveFeedTab} />

        <View className="gap-6 px-5 pb-8">
          {FEED_ITEMS.map((item) => (
            <PlaceCard key={item.title} {...item} onBookmark={() => {}} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
