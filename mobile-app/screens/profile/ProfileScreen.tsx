import { IconBookmarks, IconLogout } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';

import { AppButton } from '@/components/primitives/AppButton';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useLogout } from '@/hooks/useAuth';
import { useSavedPlaces } from '@/hooks/usePlaces';
import { useAuthStore } from '@/store/authStore';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: palette.surfaceRaised,
        borderRadius: 20,
        gap: 4,
      }}
    >
      <AppText variant="titleLG">{value}</AppText>
      <AppText variant="labelSM" color="muted">
        {label}
      </AppText>
    </View>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

export function ProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const user = useAuthStore((s) => s.user);

  // Total saved count from the first page (total is reflected in pages[0].nextCursor
  // pattern, so we sum all loaded pages as the best approximation without a separate count API)
  const { data: savedData } = useSavedPlaces();
  const savedCount = useMemo(
    () => savedData?.pages.reduce((acc, page) => acc + page.places.length, 0) ?? 0,
    [savedData],
  );

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = useCallback(() => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () =>
          logout(undefined, { onSettled: () => router.replace('/(auth)/login' as never) }),
      },
    ]);
  }, [logout, router]);

  // ── Avatar initials ──────────────────────────────────────────────────────────

  const initials = useMemo(() => {
    if (!user?.name) return user?.email?.[0]?.toUpperCase() ?? '?';
    return user.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }, [user]);

  return (
    <AppScreen scroll edges={['top']}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View className="mb-8 mt-4 items-center gap-4">
        {/* Avatar */}
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: palette.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText
            variant="titleLG"
            style={{ color: palette.background, fontSize: 32, lineHeight: 40 }}
          >
            {initials}
          </AppText>
        </View>

        {/* Name + email */}
        <View className="items-center gap-1">
          {user?.name ? <AppText variant="titleLG">{user.name}</AppText> : null}
          <AppText variant="bodySM" color="muted">
            {user?.email ?? '—'}
          </AppText>
        </View>
      </View>

      {/* ── Stats row ────────────────────────────────────────────────────────── */}
      <View className="mb-8 flex-row gap-3">
        <StatCard label="Saved" value={savedCount} />
      </View>

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      <View className="gap-3">
        {/* Go to Saved */}
        <AppButton
          variant="secondary"
          fullWidth
          leftIcon={<IconBookmarks size={18} color={palette.onSurface} />}
          onPress={() => router.push('/(tabs)/saved' as never)}
        >
          View saved places
        </AppButton>

        {/* Logout */}
        <AppButton
          variant="tertiary"
          fullWidth
          leftIcon={<IconLogout size={18} color={palette.error} />}
          loading={isLoggingOut}
          onPress={handleLogout}
        >
          Log out
        </AppButton>
      </View>
    </AppScreen>
  );
}
