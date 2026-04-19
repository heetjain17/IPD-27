import { IconHeart, IconMapPin, IconSearch, IconStar } from '@tabler/icons-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';

import { AppButton } from '@/components/primitives/AppButton';
import { AppCard } from '@/components/primitives/AppCard';
import { AppChip } from '@/components/primitives/AppChip';
import { AppIcon } from '@/components/primitives/AppIcon';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppSection } from '@/components/primitives/AppSection';
import { AppText } from '@/components/primitives/AppText';
import { useAppTheme } from '@/context/ThemeContext';

const CATEGORIES = ['All', 'Food', 'Nature', 'Culture', 'Nightlife'];

export default function HomeScreen() {
  const { toggleTheme } = useAppTheme();
  const [active, setActive] = useState('All');

  return (
    <AppScreen scroll padded>
      <View className="gap-8 pt-8">
        <AppText variant="displayMD">Step 4</AppText>

        <AppSection title="Icons">
          <View className="flex-row gap-4">
            <AppIcon Icon={IconMapPin} size="lg" color="accent" />
            <AppIcon Icon={IconStar} size="lg" color="default" />
            <AppIcon Icon={IconHeart} size="lg" color="error" />
            <AppIcon Icon={IconSearch} size="lg" color="muted" />
          </View>
        </AppSection>

        <AppSection title="Chips">
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <AppChip key={c} label={c} active={active === c} onPress={() => setActive(c)} />
            ))}
          </View>
        </AppSection>

        <AppSection
          title="Cards"
          action={
            <AppButton variant="tertiary" size="sm" onPress={toggleTheme}>
              Toggle theme
            </AppButton>
          }
        >
          <AppCard className="gap-2 p-4">
            <AppText variant="titleMD">Default card</AppText>
            <AppText variant="bodySM" color="muted">
              bg-surface-raised, rounded-roundedness-md
            </AppText>
          </AppCard>

          <AppCard elevated className="gap-2 p-4">
            <AppText variant="titleMD">Elevated card</AppText>
            <AppText variant="bodySM" color="muted">
              bg-surface, slightly higher surface
            </AppText>
          </AppCard>

          <AppCard onPress={() => {}} className="gap-2 p-4">
            <View className="flex-row items-center gap-2">
              <AppIcon Icon={IconMapPin} size="md" color="accent" />
              <AppText variant="titleMD">Pressable card</AppText>
            </View>
            <AppText variant="bodySM" color="muted">
              Tap me — opacity feedback
            </AppText>
          </AppCard>
        </AppSection>
      </View>
    </AppScreen>
  );
}
