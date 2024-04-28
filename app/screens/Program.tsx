import React, { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import {
  ActivityIndicator,
  Button,
  IconButton,
  List,
  Text,
} from "react-native-paper"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ExcersiceItem } from "../components/ExcersiceItem"
import SessionItem from "../components/SessionItem"
import { SessionDialog } from "../components/SessionDialog"
import { db } from "../../firebaseConfig"
import {
  collection,
  getDocs,
  Timestamp,
  getFirestore,
  doc,
  deleteDoc,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { app } from "../../firebaseConfig"

export interface Excersice {
  excersice: string
  kilo: string
  reps: string
  sets: string
}

export interface Session {
  category: string
  date: Timestamp
  excersices: Excersice[]
}

export interface Program {
  id: string
  session: Session
}

const Stack = createNativeStackNavigator()

export const AddPlan = ({ navigation }) => {
  const [program, setProgram] = useState<Program[]>()
  const auth = getAuth(app)
  const db = getFirestore()

  const fetchPost = async () => {
    await getDocs(collection(db, "sessions")).then((querySnapshot) => {
      const newData: Program[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        session: doc.get("session"),
      }))
      setProgram(newData)
    })
  }

  const handleDeleteProgram = async (id: string) => {
    const docRef = doc(db, "sessions", id)
    try {
      await deleteDoc(docRef).then(() => console.log("deleted"))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  if (program === undefined) {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={true} />
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        justifyContent: "center",
        flex: 1,
        marginTop: 16,
        margin: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {program.length === 0 && (
          <View
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              variant="headlineLarge"
              style={{ marginTop: 16, marginBottom: 16 }}
            >
              Welcome to this new app
            </Text>
            {auth.currentUser && (
              <Text
                variant="bodyLarge"
                style={{ marginTop: 16, marginBottom: 16 }}
              >
                {auth.currentUser.email}
              </Text>
            )}
            <Text
              variant="bodyMedium"
              style={{ marginTop: 16, marginBottom: 16 }}
            >
              You dont have any active session, please click on the button to a
              register a training session.
            </Text>
          </View>
        )}
        {auth.currentUser && (
          <Text
            variant="bodyMedium"
            style={{ marginTop: 16, marginBottom: 16 }}
          >{`Logged in as ${auth.currentUser.email}`}</Text>
        )}
        <Button
          mode="contained"
          icon={"plus"}
          style={{ width: 200 }}
          onPress={() => navigation.navigate("SessionDialog")}
        >
          Add plan
        </Button>
      </View>
      <ScrollView>
        <List.Section>
          <List.Subheader>{"Stored sessions"}</List.Subheader>
          {program.map((pr) => (
            <List.Item
              key={pr.id}
              title={`${pr.session.category}`}
              description={`Date: ${pr.session?.date
                ?.toDate()
                ?.toLocaleDateString()}`}
              left={(props) => <List.Icon {...props} icon="dumbbell" />}
              right={(props) => (
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Button
                    {...props}
                    mode="contained"
                    compact
                    onPress={() =>
                      navigation.navigate("SessionItem", {
                        id: pr.id,
                      })
                    }
                  >
                    Open
                  </Button>
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => handleDeleteProgram(pr.id)}
                  />
                </View>
              )}
            />
          ))}
        </List.Section>
      </ScrollView>
    </ScrollView>
  )
}

export const ProgramScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddPlan"
        component={AddPlan}
        options={{
          title: "My programs",
        }}
      />
      <Stack.Screen
        name="SessionItem"
        component={SessionItem}
        options={{ title: "My session" }}
      />
      <Stack.Screen
        name="SessionDialog"
        component={SessionDialog}
        options={{ header: () => null, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="ExcersiceItem"
        component={ExcersiceItem}
        options={{ title: "Add session" }}
      />
    </Stack.Navigator>
  )
}

export default ProgramScreen
