import { useLocalSearchParams } from 'expo-router';

import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';

export default function PlaceDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <AppScreen padded>
      <AppText variant="titleLG">Place Detail</AppText>
      <AppText variant="bodySM" color="muted">
        PlaceDetailScreen coming in Step 14 — id: {id}
      </AppText>
    </AppScreen>
  );
}
