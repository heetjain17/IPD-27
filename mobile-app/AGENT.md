# Project Rules

## 1. Core Principles

- Follow DESIGN.md strictly
- No hardcoded styles or colors
- Build reusable components only
- Keep everything minimal and consistent

---

## 2. Tech Stack

### UI

- NativeWind
- Custom components (no UI libraries)

### Navigation

- Expo Router

### State

- Zustand → UI/global state only

### Server State

- React Query → API data only

### API Layer

- Axios

### Forms

- React Hook Form
- Zod

### UX / Performance

- @gorhom/bottom-sheet
- @shopify/flash-list

### Native

- expo-location
- react-native-svg

---

## 3. Folder Structure

```
app/
  (routes)

components/
  primitives/
  composed/

screens/
  auth/
  explore/
  place/
  profile/

services/
  api.ts
  auth.ts
  places.ts

hooks/
  useAuth.ts
  usePlaces.ts

store/
  authStore.ts

theme/

utils/

types/
```

---

## 4. Component Rules

- Use primitives → compose into screens
- No inline styles
- No duplicate components
- All components must support theme

---

## 5. Data Rules

- No API calls inside components
- Use React Query for all API data
- Use Axios instance for requests

---

## 6. State Rules

- Zustand only for:
  - auth state
  - UI state

- Do NOT store API data in Zustand

---

## 7. Styling Rules

- Use NativeWind classes only
- Use theme tokens only
- No hex values in components

---

## 8. Screen Rules

Every screen must:

- use AppScreen wrapper
- handle loading / error / empty states
- follow spacing system
- follow typography system

---

## 9. Naming Rules

- AppButton, AppInput (primitives)
- PlaceCard, ReviewCard (composed)
- useX hooks
- camelCase for files except components

---

## 10. Do / Don’t

### Do

- reuse components
- keep UI simple
- follow system

### Don’t

- create one-off UI
- bypass design system
- mix responsibilities
