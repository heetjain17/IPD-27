import React from 'react';
import { View } from 'react-native';

import { SkeletonBox } from '@/components/primitives/SkeletonBox';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

export function PlaceCardSkeleton() {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const shape = palette.outline;

  return (
    <View style={{ backgroundColor: palette.surfaceRaised, borderRadius: 24, padding: 8 }}>
      <SkeletonBox>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Thumbnail */}
          <View style={{ width: 96, height: 96, borderRadius: 18, backgroundColor: shape }} />

          {/* Info column */}
          <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 4 }}>
            {/* Title */}
            <View style={{ gap: 6 }}>
              <View style={{ height: 18, borderRadius: 6, width: '85%', backgroundColor: shape }} />
              <View style={{ height: 13, borderRadius: 6, width: '55%', backgroundColor: shape }} />
            </View>

            {/* Rating */}
            <View style={{ height: 13, borderRadius: 6, width: 90, backgroundColor: shape }} />

            {/* Tags */}
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={{ height: 22, width: 60, borderRadius: 999, backgroundColor: shape }} />
              <View style={{ height: 22, width: 72, borderRadius: 999, backgroundColor: shape }} />
              <View style={{ height: 22, width: 50, borderRadius: 999, backgroundColor: shape }} />
            </View>
          </View>
        </View>
      </SkeletonBox>
    </View>
  );
}
