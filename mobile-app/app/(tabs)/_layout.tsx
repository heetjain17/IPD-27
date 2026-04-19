import { IconBookmark, IconCompass, IconUser } from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

export default function TabsLayout() {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.outline,
          height: 60,
          paddingTop: 5,
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.onSurfaceMuted,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <IconCompass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <IconBookmark size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <IconUser size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="explore/[id]" options={{ href: null }} />
    </Tabs>
  );
}
