import {
  IconArrowLeft,
  IconClock,
  IconCurrencyRupee,
  IconMapPin,
  IconShieldCheck,
} from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MediaStrip } from '@/components/composed/MediaStrip';
import { RatingRow } from '@/components/composed/RatingRow';
import { ReviewCard } from '@/components/composed/ReviewCard';
import { AppButton } from '@/components/primitives/AppButton';
import { AppChip } from '@/components/primitives/AppChip';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppSection } from '@/components/primitives/AppSection';
import { AppText } from '@/components/primitives/AppText';
import { PlaceDetailSkeleton } from '@/components/composed/PlaceDetailSkeleton';
import { ErrorState } from '@/components/primitives/ErrorState';
import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { usePlace, usePlaceReviews } from '@/hooks/usePlaces';

function DetailRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-start gap-2">
      <View className="mt-0.5">{icon}</View>
      <AppText variant="bodySM" color="muted" className="flex-1">
        {label}
      </AppText>
    </View>
  );
}

export function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const { data: place, isPending, isError, error, refetch } = usePlace(id);
  const { data: reviewsData, fetchNextPage, hasNextPage, isFetchingNextPage } = usePlaceReviews(id);

  const reviews = reviewsData?.pages.flatMap((p) => p.reviews) ?? [];

  const BackButton = (
    <Pressable
      onPress={() => router.back()}
      className="items-center justify-center rounded-full active:opacity-70"
      style={{
        position: 'absolute',
        top: top + 12,
        left: 16,
        width: 40,
        height: 40,
        backgroundColor: palette.surface + 'DD',
        zIndex: 10,
      }}
    >
      <IconArrowLeft size={20} color={palette.onSurface} />
    </Pressable>
  );

  if (isPending) {
    return (
      <AppScreen padded={false} edges={[]}>
        {BackButton}
        <PlaceDetailSkeleton />
      </AppScreen>
    );
  }

  if (isError || !place) {
    return (
      <AppScreen padded={false} edges={[]}>
        {BackButton}
        <ErrorState
          title="Couldn't load place"
          message={(error as Error | null)?.message ?? 'Something went wrong'}
          onRetry={() => void refetch()}
        />
      </AppScreen>
    );
  }

  const heroUrl = place.thumbnail ?? place.media[0]?.url ?? null;
  const description = place.description ?? place.customDescription ?? place.vibe ?? null;

  return (
    <AppScreen padded={false} edges={[]}>
      {BackButton}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero image */}
        <View style={{ height: 280 }} className="bg-surface-subtle">
          {heroUrl ? (
            <Image
              source={{ uri: heroUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <IconMapPin size={48} color={palette.onSurfaceMuted} />
            </View>
          )}
        </View>

        {/* Name + category + rating */}
        <View className="gap-3 px-4 pt-5">
          <View className="gap-1.5">
            <AppText variant="displayMD" numberOfLines={2}>
              {place.name}
            </AppText>
            <View className="flex-row items-center gap-2">
              <AppChip label={place.category} size="sm" />
              {place.verified && (
                <View className="flex-row items-center gap-1">
                  <IconShieldCheck size={14} color={palette.primary} />
                  <AppText variant="labelSM" style={{ color: palette.primary }}>
                    Verified
                  </AppText>
                </View>
              )}
            </View>
          </View>
          <RatingRow rating={place.averageRating} count={place.reviewCount} />
        </View>

        {/* Tags */}
        {place.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 pt-4"
          >
            {place.tags.map((tag) => (
              <AppChip key={tag} label={tag} size="sm" />
            ))}
          </ScrollView>
        )}

        {/* About */}
        {description && (
          <AppSection title="About" className="mt-6 px-4">
            <AppText variant="bodySM" color="muted">
              {description}
            </AppText>
          </AppSection>
        )}

        {/* Details */}
        <AppSection title="Details" className="mt-6 px-4">
          <View className="gap-2.5">
            {place.address && (
              <DetailRow
                icon={<IconMapPin size={15} color={palette.onSurfaceMuted} />}
                label={place.address}
              />
            )}
            {place.bestTimeToVisit && (
              <DetailRow
                icon={<IconClock size={15} color={palette.onSurfaceMuted} />}
                label={`Best time: ${place.bestTimeToVisit}`}
              />
            )}
            {place.avgCostForTwo != null && (
              <DetailRow
                icon={<IconCurrencyRupee size={15} color={palette.onSurfaceMuted} />}
                label={`~₹${place.avgCostForTwo} for two`}
              />
            )}
          </View>
        </AppSection>

        {/* Navigate */}
        <View className="mt-6 px-4">
          <AppButton
            variant="primary"
            fullWidth
            leftIcon={<IconMapPin size={18} color={palette.background} />}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
              )
            }
          >
            Navigate
          </AppButton>
        </View>

        {/* Photos */}
        {place.media.length > 0 && (
          <AppSection title="Photos" className="mt-6">
            <MediaStrip media={place.media} />
          </AppSection>
        )}

        {/* Reviews */}
        <AppSection title="Reviews" className="mt-6 px-4">
          {reviews.length === 0 ? (
            <AppText variant="bodySM" color="muted">
              No reviews yet.
            </AppText>
          ) : (
            <View className="gap-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {hasNextPage && (
                <AppButton
                  variant="secondary"
                  size="sm"
                  loading={isFetchingNextPage}
                  onPress={() => void fetchNextPage()}
                >
                  Load more
                </AppButton>
              )}
            </View>
          )}
        </AppSection>
      </ScrollView>
    </AppScreen>
  );
}
