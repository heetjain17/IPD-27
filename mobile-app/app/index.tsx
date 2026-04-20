import { View } from 'react-native';
import { SkeletonBox } from '@/components/primitives/SkeletonBox';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

export default function BootScreen() {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  return (
    <View
      style={{ flex: 1, padding: 16, paddingTop: 60, gap: 12, backgroundColor: palette.background }}
    >
      <SkeletonBox>
        <View style={{ gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={i}
              style={{
                backgroundColor: palette.surfaceRaised,
                borderRadius: 24,
                padding: 8,
                flexDirection: 'row',
                gap: 12,
              }}
            >
              <View style={{ width: 96, height: 96, borderRadius: 18 }} />
              <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 4 }}>
                <View style={{ gap: 6 }}>
                  <View style={{ height: 18, borderRadius: 6, width: '80%' }} />
                  <View style={{ height: 13, borderRadius: 6, width: '50%' }} />
                </View>
                <View style={{ height: 13, borderRadius: 6, width: 90 }} />
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <View style={{ height: 22, width: 60, borderRadius: 999 }} />
                  <View style={{ height: 22, width: 72, borderRadius: 999 }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </SkeletonBox>
    </View>
  );
}
