# Tourism — Mobile App

Expo (React Native) app for the tourism discovery platform. Built with **NativeWind**, **Expo Router**, **TanStack Query**, and **Zustand**.

## Tech Stack

| Layer          | Library                         |
| -------------- | ------------------------------- |
| Framework      | Expo SDK 52 + Expo Router v4    |
| Styling        | NativeWind v4 (Tailwind for RN) |
| Data fetching  | TanStack React Query v5         |
| Auth state     | Zustand + AsyncStorage          |
| List rendering | Shopify FlashList v2            |
| Images         | Expo Image                      |
| Bottom sheet   | @gorhom/bottom-sheet v5         |
| HTTP client    | Axios                           |
| Icons          | @tabler/icons-react-native      |

## Setup

```bash
npm install
```

Copy the env file and fill in your values:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_API_URL=http://<laptop-ip>:3000   # find with: ip a
EXPO_PUBLIC_MOCK_LOCATION=true                # set to bypass GPS (uses Mumbai coords)
```

Start the dev server:

```bash
npx expo start
```

## Available Scripts

```bash
npm run start        # Start Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run code:fix     # format + lint:fix together
```

## Project Structure

```
app/                        # Expo Router file-based routes
├── _layout.tsx             # Root layout — theme, query client, auth guard
├── index.tsx               # Boot screen (redirects based on auth state)
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/
    ├── _layout.tsx         # Tab bar (Explore, Saved, Profile)
    ├── explore.tsx         # Mounts ExploreScreen
    ├── explore/[id].tsx    # Mounts PlaceDetailScreen
    ├── saved.tsx           # Placeholder
    └── profile.tsx         # Placeholder

screens/                    # Screen-level components (mounted by app/ routes)
├── explore/
│   └── ExploreScreen.tsx
└── place/
    └── PlaceDetailScreen.tsx

components/
├── primitives/             # Base UI building blocks
│   ├── AppScreen.tsx       # Safe-area screen wrapper
│   ├── AppText.tsx         # Typography with variants
│   ├── AppButton.tsx       # Button (primary / secondary / ghost, sizes)
│   ├── AppInput.tsx        # Text input with label and error state
│   ├── AppCard.tsx         # Pressable card container
│   ├── AppChip.tsx         # Chip / tag pill (active state, normalizes labels)
│   ├── AppIcon.tsx         # Themed icon wrapper
│   ├── AppSection.tsx      # Section with title and optional action
│   ├── LoadingState.tsx    # Full-screen / inline spinner
│   ├── ErrorState.tsx      # Error message with retry button
│   └── EmptyState.tsx      # Empty list state with icon + message
└── composed/               # Feature components built from primitives
    ├── PlaceCard.tsx        # Horizontal card: thumbnail, name, rating, tags
    ├── SearchBar.tsx        # Search input with clear button
    ├── FilterChipGroup.tsx  # Horizontal (or wrapping) chip selector
    ├── FiltersSheet.tsx     # Bottom sheet: sort, category, area filters
    ├── RatingRow.tsx        # Star icons + numeric rating + review count
    ├── ReviewCard.tsx       # Review card: rating, relative date, comment
    └── MediaStrip.tsx       # Horizontal scrollable photo strip

hooks/                      # TanStack Query hooks
├── useAuth.ts              # login, register, logout, me
├── usePlaces.ts            # usePlaces (infinite), usePlace, useFilters
├── useReviews.ts           # usePlaceReviews (infinite)
├── useSavedPlaces.ts       # useSavedPlaces, useSavePlace, useUnsavePlace
└── useTags.ts              # useTags

services/                   # Raw Axios API calls (no React)
├── api.ts                  # Axios instance (baseURL, auth interceptor)
├── auth.ts                 # login, register, logout, me
├── places.ts               # getPlaces, getPlace, getFilters
├── reviews.ts              # getPlaceReviews
├── savedPlaces.ts          # getSaved, savePlace, unsavePlace
└── tags.ts                 # getTags

store/
└── authStore.ts            # Zustand store — user, tokens, hydration

constants/
├── colors.ts               # Light + dark palette tokens
└── spacing.ts              # Spacing scale

context/
└── ThemeContext.tsx         # Theme provider (light / dark / system)

types/
└── api.ts                  # All API request/response TypeScript types
```

## Screens

### Implemented

| Screen          | Route                  | Status |
| --------------- | ---------------------- | ------ |
| Boot / redirect | `/`                    | ✅     |
| Login           | `/(auth)/login`        | ✅     |
| Register        | `/(auth)/register`     | ✅     |
| Explore         | `/(tabs)/explore`      | ✅     |
| Place Detail    | `/(tabs)/explore/[id]` | ✅     |

### Pending

| Screen       | Route             | Notes                                              |
| ------------ | ----------------- | -------------------------------------------------- |
| Saved Places | `/(tabs)/saved`   | Placeholder — needs `useSavedPlaces` + `FlashList` |
| Profile      | `/(tabs)/profile` | Placeholder — needs user info + logout             |

## Components

### Primitives — all implemented ✅

`AppScreen` · `AppText` · `AppButton` · `AppInput` · `AppCard` · `AppChip` · `AppIcon` · `AppSection` · `LoadingState` · `ErrorState` · `EmptyState`

### Composed — all implemented ✅

`PlaceCard` · `SearchBar` · `FilterChipGroup` · `FiltersSheet` · `RatingRow` · `ReviewCard` · `MediaStrip`

### Pending / not yet built

| Component          | Purpose                                                     |
| ------------------ | ----------------------------------------------------------- |
| `WriteReviewSheet` | Bottom sheet form to submit a star rating + comment         |
| `SaveButton`       | Heart icon button that calls save/unsave, optimistic update |
| `PlaceMapView`     | Embedded map showing a single place pin                     |
| `SavedPlaceCard`   | Compact card variant for the Saved screen                   |
| `UserAvatar`       | Avatar circle with initials fallback                        |

## Key Patterns

- **No API calls in components** — all network access goes through hooks.
- **No hardcoded colours** — use `Colors[colorScheme].X` or NativeWind tokens.
- **Every screen wrapped in `AppScreen`** — handles safe area and background.
- **Every async screen handles** loading / error / empty states explicitly.
- **Dark + light mode** — all components respect `colorScheme` from `ThemeContext`.
- **Label normalisation** — `AppChip` strips underscores and title-cases labels in JS (avoids React Native `textTransform` clipping bug).
