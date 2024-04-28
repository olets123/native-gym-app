import { View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ActivityIndicator } from "react-native-paper"
import React, { useContext } from "react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { app } from "../firebaseConfig"
import { SignInPage } from "./screens/SignIn"
import { SignUpPage } from "./screens/SignUp"
import ProgramScreen from "./screens/Program"
import { SettingsScreen } from "./screens/Settings"
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native"
import {
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperLightTheme,
  Provider as PaperProvider,
} from "react-native-paper"
type AppTheme = "light" | "dark"
export type ThemeContextProps = {
  theme: AppTheme
  onThemeChange: (theme: AppTheme) => void
}

export const ThemeContext = React.createContext<ThemeContextProps | null>(null)

export type SnackbarT = "success" | "error" | "none"

const Tab = createBottomTabNavigator()

export default function App() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [user, setUser] = React.useState<User>()
  const [theme, changeTheme] = React.useState<AppTheme>("light")

  const auth = getAuth(app)

  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: { ...PaperDarkTheme.colors, ...NavigationDarkTheme.colors },
  }
  const CombinedLightTheme = {
    ...PaperLightTheme,
    ...NavigationDefaultTheme,
    colors: { ...PaperLightTheme.colors, ...NavigationDefaultTheme.colors },
  }

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      async (user) => {
        if (user !== undefined) {
          setUser(user)
          setIsLoading(false)
        } else {
          setUser(undefined)
          setIsLoading(false)
        }
      }
    )

    return unsubscribeFromAuthStatuChanged
  }, [auth])

  if (isLoading) {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={isLoading} />
      </View>
    )
  }

  return (
    <ThemeContext.Provider
      value={{ theme: theme, onThemeChange: (theme) => changeTheme(theme) }}
    >
      <PaperProvider
        theme={
          theme !== null && theme === "light"
            ? CombinedLightTheme
            : CombinedDarkTheme
        }
      >
        <NavigationContainer
          independent={true}
          theme={
            theme !== null && theme === "light"
              ? CombinedLightTheme
              : CombinedDarkTheme
          }
        >
          {user !== null ? (
            <Tab.Navigator screenOptions={{ header: () => null }}>
              <Tab.Screen
                name="Program"
                component={ProgramScreen}
                options={{ tabBarIcon: makeIconRender("dumbbell") }}
              />

              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ tabBarIcon: makeIconRender("cog") }}
              />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator
              tabBar={() => null}
              screenOptions={{ header: () => null }}
            >
              <Tab.Screen
                name="SignIn"
                component={SignInPage}
                options={{ title: "Sign in" }}
              />
              <Tab.Screen
                name="SignUp"
                component={SignUpPage}
                options={{ title: "Sign up" }}
              />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  )
}

export function makeIconRender(name) {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  )
}
