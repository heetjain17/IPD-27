import { ScrollView } from 'react-native';

import { AppChip } from '@/components/primitives/AppChip';

interface FilterChipGroupProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  className?: string;
}

export function FilterChipGroup({
  options,
  selected,
  onSelect,
  className = '',
}: FilterChipGroupProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={`gap-2 px-4 ${className}`}
    >
      {options.map((option) => (
        <AppChip
          key={option}
          label={option}
          active={selected === option}
          onPress={() => onSelect(selected === option ? null : option)}
        />
      ))}
    </ScrollView>
  );
}
