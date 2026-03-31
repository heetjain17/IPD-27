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

type TablerIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const TabIcon = ({ icon: Icon, focused }: { icon: TablerIcon; focused: boolean }) => (
  <View className="h-12 w-12 items-center justify-center">
    <Icon size={22} color={focused ? '#d7fd4e' : '#adaaaa'} strokeWidth={focused ? 2 : 1.5} />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#d7fd4e',
        tabBarInactiveTintColor: '#adaaaa',
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
          backgroundColor: '#191a1a',
          borderTopColor: 'rgba(72,72,72,0.3)',
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
          tabBarIcon: ({ focused }) => <TabIcon icon={IconCompass} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => <TabIcon icon={IconMap2} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon icon={IconSearch} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => <TabIcon icon={IconBookmark} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon icon={IconUser} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
