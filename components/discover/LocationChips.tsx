import { IconMapPin } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  locations: string[];
};

export function LocationChips({ locations }: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingRight: 8 }}
    >
      {locations.map((loc) => (
        <Pressable
          key={loc}
          className={`flex-row items-center gap-2 rounded-roundedness-md border border-outline-variant/20 px-3 py-2.5 ${
            isDark ? 'bg-surface-container-highest' : 'bg-light-surface-container-highest'
          }`}
        >
          <View
            className={`h-7 w-7 items-center justify-center rounded-roundedness-full ${
              isDark ? 'bg-surface-container' : 'bg-light-surface-container-low'
            }`}
          >
            <IconMapPin size={13} color="#adaaaa" strokeWidth={1.8} />
          </View>
          <Text
            className={`font-body text-body-sm font-semibold ${
              isDark ? 'text-on-surface' : 'text-light-on-surface'
            }`}
          >
            {loc}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
