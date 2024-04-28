import { View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  ActivityIndicator,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper"
import React from "react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { app } from "../firebaseConfig"
import { SignInPage } from "./screens/SignIn"
import { SignUpPage } from "./screens/SignUp"
import ProgramScreen from "./screens/Program"
import { SettingsScreen } from "./screens/SignOut"
import { ThemeProp } from "react-native-paper/lib/typescript/types"

export type SnackbarT = "success" | "error" | "none"

const Tab = createBottomTabNavigator()

export default function App() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const [user, setUser] = React.useState<User>()
  const auth = getAuth(app)
  const { LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavigationDarkTheme,
    reactNavigationLight: NavigationDefaultTheme,
  })

  const theme: ThemeProp = {
    ...NavigationDefaultTheme, // or MD3DarkTheme
    roundness: 2,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: "#3498db",
      secondary: "#f1c40f",
      tertiary: "#a1b2c3",
      background: "white",
    },
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
    <PaperProvider theme={theme}>
      <NavigationContainer independent={true} theme={LightTheme}>
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
  )
}

export function makeIconRender(name) {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  )
}
