import { ScrollView, View } from 'react-native';

import { AppChip } from '@/components/primitives/AppChip';

interface FilterChipGroupProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  wrap?: boolean;
  className?: string;
}

export function FilterChipGroup({
  options,
  selected,
  onSelect,
  wrap = false,
  className = '',
}: FilterChipGroupProps) {
  const chips = options.map((option) => (
    <AppChip
      key={option}
      label={option}
      active={selected === option}
      onPress={() => onSelect(selected === option ? null : option)}
    />
  ));

  if (wrap) {
    return <View className={`flex-row flex-wrap gap-2 ${className}`}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={`gap-2 px-4 ${className}`}
    >
      {chips}
    </ScrollView>
  );
}
