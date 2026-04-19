import React, { useState } from 'react';
import { View } from 'react-native';

import { AppButton } from '@/components/primitives/AppButton';
import { AppInput } from '@/components/primitives/AppInput';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';
import { useAppTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { toggleTheme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AppScreen scroll padded>
      <View className="gap-6 pt-8">
        <AppText variant="displayMD">Step 3</AppText>
        <AppText variant="bodyLG" color="muted">
          AppButton + AppInput primitives
        </AppText>

        <View className="gap-3">
          <AppInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            label="Password"
            placeholder="Min 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={password.length > 0 && password.length < 8 ? 'Password too short' : undefined}
          />
          <AppInput
            label="With helper"
            placeholder="Optional field"
            helper="This field is optional"
          />
        </View>

        <View className="gap-3">
          <AppButton onPress={toggleTheme} fullWidth>
            Primary Button
          </AppButton>
          <AppButton variant="secondary" fullWidth>
            Secondary Button
          </AppButton>
          <AppButton variant="tertiary" fullWidth>
            Tertiary Button
          </AppButton>
          <AppButton loading fullWidth>
            Loading State
          </AppButton>
          <AppButton disabled fullWidth>
            Disabled State
          </AppButton>
        </View>
      </View>
    </AppScreen>
  );
}
