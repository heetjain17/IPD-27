import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { FilterChipGroup } from '@/components/composed/FilterChipGroup';
import { AppButton } from '@/components/primitives/AppButton';
import { AppSection } from '@/components/primitives/AppSection';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useFilters } from '@/hooks/usePlaces';
import type { PlacesSortKey } from '@/types/api';

const SORT_OPTIONS: PlacesSortKey[] = [
  'priority',
  'distance',
  'rating',
  'newest',
  'price_low',
  'price_high',
];

const SORT_LABELS: Record<PlacesSortKey, string> = {
  priority: 'Recommended',
  distance: 'Nearest',
  rating: 'Top rated',
  newest: 'Newest',
  price_low: 'Price ↑',
  price_high: 'Price ↓',
};

export interface FiltersValue {
  sort: PlacesSortKey;
  category: string | null;
  area: string | null;
}

const DEFAULT_FILTERS: FiltersValue = {
  sort: 'priority',
  category: null,
  area: null,
};

interface FiltersSheetProps {
  value: FiltersValue;
  onApply: (v: FiltersValue) => void;
}

export const FiltersSheet = forwardRef<BottomSheetModal, FiltersSheetProps>(
  ({ value, onApply }, ref) => {
    const { colorScheme } = useAppTheme();
    const palette = Colors[colorScheme];
    const { data: filters } = useFilters();

    const [local, setLocal] = useState<FiltersValue>(value);
    const snapPoints = useMemo(() => ['60%', '90%'], []);

    useEffect(() => {
      setLocal(value);
    }, [value]);

    const handleApply = useCallback(() => {
      onApply(local);
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    }, [local, onApply, ref]);

    const handleReset = useCallback(() => {
      setLocal(DEFAULT_FILTERS);
      onApply(DEFAULT_FILTERS);
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    }, [onApply, ref]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: palette.surface }}
        handleIndicatorStyle={{ backgroundColor: palette.onSurfaceMuted, width: 40 }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="gap-6 px-4 pt-2">
            {/* Sort */}
            <AppSection title="Sort by">
              <FilterChipGroup
                wrap
                options={SORT_OPTIONS.map((k) => SORT_LABELS[k])}
                selected={SORT_LABELS[local.sort]}
                onSelect={(label) => {
                  const key = (Object.keys(SORT_LABELS) as PlacesSortKey[]).find(
                    (k) => SORT_LABELS[k] === label,
                  );
                  if (key) setLocal((s) => ({ ...s, sort: key }));
                }}
              />
            </AppSection>

            {/* Category */}
            {(filters?.categories?.length ?? 0) > 0 && (
              <AppSection title="Category">
                <FilterChipGroup
                  wrap
                  options={filters!.categories}
                  selected={local.category}
                  onSelect={(v) => setLocal((s) => ({ ...s, category: v }))}
                />
              </AppSection>
            )}

            {/* Area */}
            {(filters?.areas?.length ?? 0) > 0 && (
              <AppSection title="Area">
                <FilterChipGroup
                  wrap
                  options={filters!.areas}
                  selected={local.area}
                  onSelect={(v) => setLocal((s) => ({ ...s, area: v }))}
                />
              </AppSection>
            )}
          </View>
        </BottomSheetScrollView>

        {/* Footer */}
        <View
          className="flex-row gap-3 px-4 py-4"
          style={{ borderTopWidth: 1, borderTopColor: palette.outline }}
        >
          <AppButton variant="secondary" onPress={handleReset} className="flex-1">
            Reset
          </AppButton>
          <AppButton variant="primary" onPress={handleApply} className="flex-1">
            Apply
          </AppButton>
        </View>
      </BottomSheetModal>
    );
  },
);

FiltersSheet.displayName = 'FiltersSheet';
