import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-surface-lowest' : 'bg-light-surface-lowest'}`}
    >
      <ScrollView
        contentContainerClassName="px-6 pb-16"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View className="flex-row items-center justify-between pt-12 pb-8">
          <View>
            <Text
              className={`text-label-sm font-body uppercase tracking-widest ${
                isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
              }`}
            >
              Design System
            </Text>
            <Text
              className={`text-display-md font-display mt-1 ${
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
          className={`rounded-roundedness-lg p-6 mb-6 ${
            isDark ? 'bg-surface-container' : 'bg-light-surface-container'
          }`}
        >
          <Text
            className={`text-label-sm font-body uppercase tracking-widest mb-3 ${
              isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
            }`}
          >
            Primary Accent
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-roundedness-md bg-primary" />
            <View>
              <Text
                className={`text-title-md font-display ${
                  isDark ? 'text-on-surface' : 'text-light-on-surface'
                }`}
              >
                #D7FD4E
              </Text>
              <Text
                className={`text-body-sm font-body ${
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
          className={`text-label-sm font-body uppercase tracking-widest mb-3 ${
            isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
          }`}
        >
          Surface Hierarchy
        </Text>
        <View className="gap-3 mb-6">
          {[
            { label: 'surface-lowest',           darkCls: 'bg-surface-lowest',           lightCls: 'bg-light-surface-lowest' },
            { label: 'surface',                  darkCls: 'bg-surface',                  lightCls: 'bg-light-surface' },
            { label: 'surface-container-low',    darkCls: 'bg-surface-container-low',    lightCls: 'bg-light-surface-container-low' },
            { label: 'surface-container',        darkCls: 'bg-surface-container',        lightCls: 'bg-light-surface-container' },
            { label: 'surface-container-highest',darkCls: 'bg-surface-container-highest',lightCls: 'bg-light-surface-container-highest' },
          ].map(({ label, darkCls, lightCls }) => (
            <View
              key={label}
              className={`rounded-roundedness-md px-4 py-3 flex-row items-center justify-between border border-outline-variant/20 ${
                isDark ? darkCls : lightCls
              }`}
            >
              <Text
                className={`text-body-sm font-body ${
                  isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
                }`}
              >
                {label}
              </Text>
              <View className="w-4 h-4 rounded-full bg-primary opacity-80" />
            </View>
          ))}
        </View>

        {/* ── Typography Scale ────────────────────────────────────────────── */}
        <View
          className={`rounded-roundedness-lg p-6 mb-6 ${
            isDark ? 'bg-surface-container' : 'bg-light-surface-container'
          }`}
        >
          <Text
            className={`text-label-sm font-body uppercase tracking-widest mb-4 ${
              isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
            }`}
          >
            Typography
          </Text>
          <Text
            className={`text-title-lg font-display mb-1 ${
              isDark ? 'text-on-surface' : 'text-light-on-surface'
            }`}
          >
            Manrope — Display
          </Text>
          <Text
            className={`text-body-lg font-body mb-1 ${
              isDark ? 'text-on-surface' : 'text-light-on-surface'
            }`}
          >
            Inter — Body text at 1.6 line-height
          </Text>
          <Text
            className={`text-label-sm font-body uppercase tracking-widest ${
              isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
            }`}
          >
            label — small caps
          </Text>
        </View>

        {/* ── Button Primitives ───────────────────────────────────────────── */}
        <Text
          className={`text-label-sm font-body uppercase tracking-widest mb-3 ${
            isDark ? 'text-on-surface-variant' : 'text-light-on-surface-variant'
          }`}
        >
          Button Primitives
        </Text>
        <View className="gap-3">
          {/* Primary */}
          <View className="bg-primary rounded-roundedness-xl px-6 py-4 items-center">
            <Text className="text-on-primary font-display font-semibold text-body-lg">
              Primary Button
            </Text>
          </View>
          {/* Secondary */}
          <View
            className={`rounded-roundedness-xl px-6 py-4 items-center ${
              isDark ? 'bg-surface-container-highest' : 'bg-light-surface-container-highest'
            }`}
          >
            <Text
              className={`font-body font-semibold text-body-lg ${
                isDark ? 'text-on-surface' : 'text-light-on-surface'
              }`}
            >
              Secondary Button
            </Text>
          </View>
          {/* Tertiary */}
          <View className="px-6 py-4 items-center">
            <Text className="text-primary font-body font-semibold text-body-lg">
              Tertiary Button
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
