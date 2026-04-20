import React from 'react';
import { ScrollView, View } from 'react-native';

import { SkeletonBox } from '@/components/primitives/SkeletonBox';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

export function PlaceDetailSkeleton() {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const shape = palette.outline;
  const bg = palette.background;

  return (
    <ScrollView
      scrollEnabled={false}
      style={{ backgroundColor: bg }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <SkeletonBox>
        <View>
          {/* Hero */}
          <View style={{ height: 280, width: '100%', backgroundColor: shape }} />

          {/* Name + category + rating */}
          <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 12 }}>
            <View style={{ gap: 8 }}>
              <View style={{ height: 32, borderRadius: 8, width: '75%', backgroundColor: shape }} />
              <View style={{ height: 24, borderRadius: 999, width: 90, backgroundColor: shape }} />
            </View>
            <View style={{ height: 16, borderRadius: 6, width: 130, backgroundColor: shape }} />
          </View>

          {/* Tags row */}
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={{ height: 26, width: 70, borderRadius: 999, backgroundColor: shape }} />
            <View style={{ height: 26, width: 88, borderRadius: 999, backgroundColor: shape }} />
            <View style={{ height: 26, width: 60, borderRadius: 999, backgroundColor: shape }} />
          </View>

          {/* About section */}
          <View style={{ paddingHorizontal: 16, paddingTop: 24, gap: 10 }}>
            <View style={{ height: 18, borderRadius: 6, width: 60, backgroundColor: shape }} />
            <View style={{ height: 13, borderRadius: 6, width: '100%', backgroundColor: shape }} />
            <View style={{ height: 13, borderRadius: 6, width: '90%', backgroundColor: shape }} />
            <View style={{ height: 13, borderRadius: 6, width: '70%', backgroundColor: shape }} />
          </View>

          {/* Details section */}
          <View style={{ paddingHorizontal: 16, paddingTop: 24, gap: 10 }}>
            <View style={{ height: 18, borderRadius: 6, width: 60, backgroundColor: shape }} />
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={{ height: 14, width: 14, borderRadius: 4, backgroundColor: shape }} />
              <View style={{ height: 13, borderRadius: 6, flex: 1, backgroundColor: shape }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={{ height: 14, width: 14, borderRadius: 4, backgroundColor: shape }} />
              <View style={{ height: 13, borderRadius: 6, width: '60%', backgroundColor: shape }} />
            </View>
          </View>

          {/* Photos strip placeholder */}
          <View style={{ paddingTop: 24, gap: 10 }}>
            <View
              style={{
                height: 18,
                borderRadius: 6,
                width: 60,
                marginLeft: 16,
                backgroundColor: shape,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16 }}>
              <View style={{ height: 100, width: 140, borderRadius: 12, backgroundColor: shape }} />
              <View style={{ height: 100, width: 140, borderRadius: 12, backgroundColor: shape }} />
              <View style={{ height: 100, width: 100, borderRadius: 12, backgroundColor: shape }} />
            </View>
          </View>
        </View>
      </SkeletonBox>
    </ScrollView>
  );
}
