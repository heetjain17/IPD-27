import { IconLock, IconMail, IconUser } from '@tabler/icons-react-native';
import type { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { AppButton } from '@/components/primitives/AppButton';
import { AppIcon } from '@/components/primitives/AppIcon';
import { AppInput } from '@/components/primitives/AppInput';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';
import { useRegister } from '@/hooks/useAuth';
import type { ApiErrorEnvelope } from '@/types/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: register, isPending, error } = useRegister();
  const router = useRouter();

  const errorMessage =
    (error as AxiosError<ApiErrorEnvelope> | null)?.response?.data?.message ??
    (error ? 'Registration failed. Please try again.' : null);

  const handleSubmit = () => {
    if (!email || !password) return;
    register({ email: email.trim(), password, name: name.trim() || undefined });
  };

  return (
    <AppScreen padded>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 justify-center gap-10 py-12">
            <View className="gap-2">
              <AppText variant="displayMD">Create account</AppText>
              <AppText variant="bodySM" color="muted">
                Start exploring hidden gems near you
              </AppText>
            </View>

            <View className="gap-4">
              <AppInput
                label="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
                placeholder="Your name"
                leftIcon={<AppIcon Icon={IconUser} size="sm" color="muted" />}
              />
              <AppInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                placeholder="you@example.com"
                leftIcon={<AppIcon Icon={IconMail} size="sm" color="muted" />}
              />
              <AppInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                placeholder="••••••••"
                leftIcon={<AppIcon Icon={IconLock} size="sm" color="muted" />}
              />

              {errorMessage && (
                <AppText variant="bodySM" color="error">
                  {errorMessage}
                </AppText>
              )}
            </View>

            <View className="gap-4">
              <AppButton
                fullWidth
                loading={isPending}
                disabled={!email || !password}
                onPress={handleSubmit}
              >
                Create account
              </AppButton>

              <View className="flex-row items-center justify-center gap-1">
                <AppText variant="bodySM" color="muted">
                  Already have an account?
                </AppText>
                <AppButton variant="tertiary" size="sm" onPress={() => router.back()}>
                  Sign in
                </AppButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
