import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';

export default function ExplorePage() {
  return (
    <AppScreen padded>
      <AppText variant="titleLG">Explore</AppText>
      <AppText variant="bodySM" color="muted">
        ExploreScreen coming in Step 12
      </AppText>
    </AppScreen>
  );
}
