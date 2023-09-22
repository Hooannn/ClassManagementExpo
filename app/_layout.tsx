import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "Onboarding",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}
const queryClient = new QueryClient();
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <ThemeProvider value={DefaultTheme}>
            <Stack initialRouteName="Onboarding">
              <Stack.Screen
                name="Onboarding"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </TamaguiProvider>
        <Toast />
      </QueryClientProvider>
    </>
  );
}
