import {
  IconBookmark,
  IconCompass,
  IconMap2,
  IconSearch,
  IconUser,
} from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';

type TablerIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const TabIcon = ({
  icon: Icon,
  focused,
  color,
}: {
  icon: TablerIcon;
  focused: boolean;
  color: string;
}) => (
  <View className="h-12 w-12 items-center justify-center">
    <Icon size={22} color={color} strokeWidth={focused ? 2 : 1.5} />
  </View>
);

export default function TabLayout() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.onSurfaceVariant,
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginTop: 1,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.surfaceContainer,
          borderTopColor: colorScheme === 'dark' ? 'rgba(72,72,72,0.3)' : 'rgba(192,192,192,0.3)',
          paddingTop: 8,
          paddingBottom: 12,
          height: 70,
          paddingHorizontal: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={IconCompass} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={IconMap2} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={IconSearch} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={IconBookmark} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={IconUser} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
