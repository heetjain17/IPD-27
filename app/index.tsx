import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-surface-lowest' : 'bg-light-surface-lowest'}`}>
      <ScrollView contentContainerClassName="px-6 pb-16" showsVerticalScrollIndicator={false}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View className="flex-row items-center justify-between pb-8 pt-12">
          <View>
            <Text
              className={`font-body text-label-sm uppercase tracking-widest ${
                isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
              }`}
            >
              Design System
            </Text>
            <Text
              className={`mt-1 font-display text-display-md ${
                isDark ? 'text-on-surface' : 'text-light-on-surface'
              }`}
            >
              Luminescent{'\n'}Curator
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* ── Primary Accent Swatch ───────────────────────────────────────── */}
        <View
          className={`mb-6 rounded-roundedness-lg p-6 ${
            isDark ? 'bg-surface-container' : 'bg-light-surface-container'
          }`}
        >
          <Text
            className={`mb-3 font-body text-label-sm uppercase tracking-widest ${
              isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
            }`}
          >
            Primary Accent
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 rounded-roundedness-md bg-primary" />
            <View>
              <Text
                className={`font-display text-title-md ${
                  isDark ? 'text-on-surface' : 'text-light-on-surface'
                }`}
              >
                #D7FD4E
              </Text>
              <Text
                className={`font-body text-body-sm ${
                  isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
                }`}
              >
                Lime — the beacon
              </Text>
            </View>
          </View>
        </View>

        {/* ── Surface Hierarchy ───────────────────────────────────────────── */}
        <Text
          className={`mb-3 font-body text-label-sm uppercase tracking-widest ${
            isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
          }`}
        >
          Surface Hierarchy
        </Text>
        <View className="mb-6 gap-3">
          {[
            {
              label: 'surface-lowest',
              darkCls: 'bg-surface-lowest',
              lightCls: 'bg-light-surface-lowest',
            },
            { label: 'surface', darkCls: 'bg-surface', lightCls: 'bg-light-surface' },
            {
              label: 'surface-container-low',
              darkCls: 'bg-surface-container-low',
              lightCls: 'bg-light-surface-container-low',
            },
            {
              label: 'surface-container',
              darkCls: 'bg-surface-container',
              lightCls: 'bg-light-surface-container',
            },
            {
              label: 'surface-container-highest',
              darkCls: 'bg-surface-container-highest',
              lightCls: 'bg-light-surface-container-highest',
            },
          ].map(({ label, darkCls, lightCls }) => (
            <View
              key={label}
              className={`flex-row items-center justify-between rounded-roundedness-md border border-outline-variant/20 px-4 py-3 ${
                isDark ? darkCls : lightCls
              }`}
            >
              <Text
                className={`font-body text-body-sm ${
                  isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
                }`}
              >
                {label}
              </Text>
              <View className="h-4 w-4 rounded-full bg-primary opacity-80" />
            </View>
          ))}
        </View>

        {/* ── Typography Scale ────────────────────────────────────────────── */}
        <View
          className={`mb-6 rounded-roundedness-lg p-6 ${
            isDark ? 'bg-surface-container' : 'bg-light-surface-container'
          }`}
        >
          <Text
            className={`mb-4 font-body text-label-sm uppercase tracking-widest ${
              isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
            }`}
          >
            Typography
          </Text>
          <Text
            className={`mb-1 font-display text-title-lg ${
              isDark ? 'text-on-surface' : 'text-light-on-surface'
            }`}
          >
            Manrope — Display
          </Text>
          <Text
            className={`mb-1 font-body text-body-lg ${
              isDark ? 'text-on-surface' : 'text-light-on-surface'
            }`}
          >
            Inter — Body text at 1.6 line-height
          </Text>
          <Text
            className={`font-body text-label-sm uppercase tracking-widest ${
              isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
            }`}
          >
            label — small caps
          </Text>
        </View>

        {/* ── Button Primitives ───────────────────────────────────────────── */}
        <Text
          className={`mb-3 font-body text-label-sm uppercase tracking-widest ${
            isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
          }`}
        >
          Button Primitives
        </Text>
        <View className="gap-3">
          {/* Primary */}
          <View className="items-center rounded-roundedness-xl bg-primary px-6 py-4">
            <Text className="font-display text-body-lg font-semibold text-on-primary">
              Primary Button
            </Text>
          </View>
          {/* Secondary */}
          <View
            className={`items-center rounded-roundedness-xl px-6 py-4 ${
              isDark ? 'bg-surface-container-highest' : 'bg-light-surface-container-highest'
            }`}
          >
            <Text
              className={`font-body text-body-lg font-semibold ${
                isDark ? 'text-on-surface' : 'text-light-on-surface'
              }`}
            >
              Secondary Button
            </Text>
          </View>
          {/* Tertiary */}
          <View className="items-center px-6 py-4">
            <Text className="font-body text-body-lg font-semibold text-primary">
              Tertiary Button
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
