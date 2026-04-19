import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';

export default function ProfilePage() {
  return (
    <AppScreen padded>
      <AppText variant="titleLG">Profile</AppText>
      <AppText variant="bodySM" color="muted">
        ProfileScreen coming soon
      </AppText>
    </AppScreen>
  );
}
