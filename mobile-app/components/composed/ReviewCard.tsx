import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { View } from 'react-native';

import { AppCard } from '@/components/primitives/AppCard';
import { AppText } from '@/components/primitives/AppText';
import type { Review } from '@/types/api';

import { RatingRow } from './RatingRow';

dayjs.extend(relativeTime);

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <AppCard>
      <View className="gap-2 p-3">
        <View className="flex-row items-center justify-between">
          <RatingRow rating={review.rating} size="sm" />
          <AppText variant="labelSM" color="muted">
            {dayjs(review.createdAt).fromNow()}
          </AppText>
        </View>
        {review.comment && (
          <AppText variant="bodySM" color="muted" numberOfLines={4}>
            {review.comment}
          </AppText>
        )}
      </View>
    </AppCard>
  );
}
