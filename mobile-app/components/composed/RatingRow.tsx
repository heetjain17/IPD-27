import { IconStar, IconStarFilled } from '@tabler/icons-react-native';
import { View } from 'react-native';

import { AppText } from '@/components/primitives/AppText';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

interface RatingRowProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export function RatingRow({ rating, count, size = 'md' }: RatingRowProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const starSize = size === 'sm' ? 12 : 16;
  const filledCount = Math.round(rating);
  const hasRating = rating > 0;

  return (
    <View className="flex-row items-center gap-1.5">
      <View className="flex-row gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < filledCount;
          const Icon = filled ? IconStarFilled : IconStar;
          return (
            <Icon
              key={i}
              size={starSize}
              color={filled ? palette.warning : palette.onSurfaceMuted}
            />
          );
        })}
      </View>
      <AppText
        variant={size === 'sm' ? 'labelSM' : 'bodySM'}
        color={hasRating ? 'default' : 'muted'}
      >
        {hasRating ? rating.toFixed(1) : 'No reviews'}
        {hasRating && count != null && count > 0 ? ` (${count})` : ''}
      </AppText>
    </View>
  );
}
