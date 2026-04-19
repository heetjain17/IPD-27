import { Image } from 'expo-image';
import { Pressable, ScrollView, View } from 'react-native';

import type { PlaceMedia } from '@/types/api';

interface MediaStripProps {
  media: PlaceMedia[];
  onPress?: (index: number) => void;
}

export function MediaStrip({ media, onPress }: MediaStripProps) {
  if (media.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
    >
      {media.map((item, index) => (
        <Pressable
          key={`${item.url}-${index}`}
          onPress={() => onPress?.(index)}
          disabled={!onPress}
          className="active:opacity-75"
        >
          <View className="h-32 w-32 overflow-hidden rounded-roundedness-sm">
            <Image
              source={{ uri: item.url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
