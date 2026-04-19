import { IconSearch, IconX } from '@tabler/icons-react-native';
import { Pressable, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search places…',
  onClear,
}: SearchBarProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      className="flex-row items-center gap-3 rounded-roundedness-full bg-surface-raised px-4 py-1"
      style={{ borderWidth: 1.5, borderColor: palette.outline }}
    >
      <IconSearch size={18} color={palette.onSurfaceMuted} />

      <TextInput
        className="flex-1 font-body text-body-lg text-on-surface"
        placeholderTextColor={palette.onSurfaceMuted}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {value.length > 0 && (
        <Pressable onPress={handleClear} className="active:opacity-60">
          <IconX size={16} color={palette.onSurfaceMuted} />
        </Pressable>
      )}
    </View>
  );
}
