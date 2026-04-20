import { View } from 'react-native';
import { AppText } from '@/components/primitives/AppText';

export default function HomeTab() {
  return (
    <View className="flex-1 items-center justify-center">
      <AppText variant="titleMD">Home — Map coming in Phase 3</AppText>
    </View>
  );
}
