import { getAuth, signOut } from "firebase/auth"
import { app } from "../../firebaseConfig"
import { View } from "react-native"
import { Button, Switch, Text } from "react-native-paper"

export const SettingsScreen = ({ navigation }) => {
  const auth = getAuth(app)
  const onLogOut = async () => {
    await signOut(auth)
    navigation.navigate("SignIn")
  }
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Switch style={{ marginRight: 8 }} />
        <Text>Dark mode</Text>
      </View>
      <Button mode="contained" style={{ width: 200 }} onPress={onLogOut}>
        {"Sign out"}
      </Button>
    </View>
  )
}
