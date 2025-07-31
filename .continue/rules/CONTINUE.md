# CONTINUE.md: Project Guide for SportSpark

---

## 1. Project Overview

**SportSpark** is a cross-platform mobile application built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev). Its structure is optimized for rapid prototyping and clean code organization using file-based routing. The project supports iOS, Android, and Web, providing a universal codebase and a vibrant developer experience.

### Key Technologies

- **Expo**: Simplifies React Native development and deployment
- **React Native**: Cross-platform mobile development
- **expo-router**: File-based navigation/routing
- **TypeScript**: Type safety
- **React Navigation**: Navigation framework
- Other Expo SDKs: Fonts, images, haptics, status bar, splash screen, etc.
- **ESLint**: Linting and code standards

### High-Level Architecture

- **app/**: File-based routing structure (each TS/TSX file is a route)
- **components/**: Reusable UI and utility components
- **hooks/**: Custom React hooks for themes, etc.
- **constants/**: Shared configuration (colors, etc.)

---

## 2. Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/get-npm)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`

### Installation

npm install

### Running the App

npx expo start

Then follow the prompts to run on iOS, Android, or Web.

### Basic Usage

- Main entry point: `app/landing.tsx`
- Go to the dashboard at `/dashboard` (see `app/dashboard/index.tsx`).

### Running Tests

*No tests are set up by default in this template.* To add testing, consider [Jest](https://jestjs.io/) or [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/). *(Needs verification)*

---

## 3. Project Structure

app/
├── landing.tsx        // Entry/landing page (“flirty”)
├── dashboard/
│   ├── _layout.tsx    // Dashboard’s layout (tabs/stack, optional)
│   └── index.tsx      // Dashboard home (“commitment!”)
├── (tabs)/            // (If using for other tab features)
│   ├── index.tsx
│   └── ...
├──_layout.tsx        // App-wide stack or tab navigation
├── +not-found.tsx     // 404 or fallback screen
components/
├── [shared UI components]
├── ui/
│   └── [UI utilities/icons]

hooks/
├── [custom hooks for color scheme, theme, etc.]

constants/
├── Colors.ts          // App-wide color definitions
├── [other central constants]

assets/
├── fonts/
├── images/

scripts/
├── reset-project.js

package.json           // Project dependencies and scripts
app.json               // App configuration for Expo
eslint.config.js       // Linting rules
tsconfig.json          // TypeScript configuration
---

## 4. Development Workflow

### Coding Standards

- Use TypeScript for all code in `app/`, `components/`, and `hooks/`
- Follow linting rules via `eslint.config.js` (run `npm run lint`)
- Reusable logic goes in custom hooks or components

### Navigation/Routes

- Add a new screen by creating a file in `app/` or its subdirectories
- Use React Navigation via expo-router

### Theming

- Use the `useColorScheme` and `useThemeColor` hooks for light/dark support
- Colors are managed centrally in `constants/Colors.ts`

### Testing

- Add tests and test scripts (not included by default—setup recommended)

### Build & Deployment

- For development: `npx expo start`
- For building: Follow [Expo build docs](https://docs.expo.dev/build/introduction/). *(Needs verification for custom workflow)*

### Contribution Guidelines

- Use branches and PRs for changes (recommendation)
- Add documentation for new components/hooks
- Format code and ensure lint passes before merging

---

## 5. Key Concepts

- **File-based Routing**: Place `.tsx` or `.ts` files under `app/` for automatic route creation.

- **Landing Page**: `app/landing.tsx` serves as the entry/landing page (“flirty” introduction).
- **Dashboard**: `app/dashboard/` contains the main dashboard features; `index.tsx` is the dashboard home (“commitment!”). `_layout.tsx` can provide nested nav/layout.
- **Tabs Navigation**: Use `(tabs)/` or other folders for grouped tabbed routes as needed.
- **Custom Hooks**: Shareable logic for color schemes, theming.
- **Reusable Components**: Found in `components/`, designed for portability.
- **Expo Modules**: Components from Expo SDK (status bar, splash, haptics, etc.)
- **Theming**: Support for light/dark UI modes across the app.

---

## 6. Common Tasks

### Add a New Screen

1. Create a new file (e.g., `app/my-screen.tsx` or under `dashboard/`).
2. Implement a React component as the default export.

3. The screen will be available at `/my-screen` or `/dashboard/my-screen` depending on location.

### Add or Update Landing Page

1. Edit `app/landing.tsx` to customize the entry/landing experience.

### Add or Update Dashboard

1. Edit files in `app/dashboard/`.
2. Use or modify `_layout.tsx` for custom layout/navigation within dashboard.
3. Add screens as new files, e.g., `app/dashboard/stats.tsx` → `/dashboard/stats`.

### Update Tab Navigation

1. Edit `app/(tabs)/_layout.tsx` to add/remove tab screens.

### Add a New Component

1. Add your file to `components/` or `components/ui/`.
2. Import and use in your route/component.

### Update Theme Colors

- Edit `constants/Colors.ts` to change global color palette.

### Change App Config

- Edit `app.json` (name, icons, splash, plugins, etc.)

### Reset Project Structure

- Run `npm run reset-project` and follow prompts. (Backs up example code or wipes to blank)

---

## 7. Troubleshooting

### App Won't Start

- Ensure dependencies (`npm install`) are complete
- Try clearing metro bundler cache: `npx expo start -c`

### Unknown Module Errors

- Double-check you are `import`ing from correct paths
- Check `tsconfig.json` for path mapping issues

### Can't Load Custom Fonts

- Confirm font is inside `assets/fonts/`
- See Expo Font docs: <https://docs.expo.dev/versions/latest/sdk/font/>

### Routing Issues

- Make sure all route file exports are default React components
- Check file naming and extension (`.tsx` for components)

---

## 8. References

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [expo-router](https://expo.github.io/router/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [ESLint](https://eslint.org/)
- [Jest (Testing)](https://jestjs.io/)

---

> **Note:** If any section is marked as *(Needs verification)*, please review and fill in with project-specific details.
