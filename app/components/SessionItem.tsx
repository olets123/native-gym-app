import { Timestamp, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { ActivityIndicator, List } from "react-native-paper"
import { Session } from "@app/screens/Program"

export const SessionItem = ({ route }) => {
  const [session, setSession] = useState<Session>()
  const getSessions = async () => {
    try {
      if (route.params?.id) {
        const docRef = doc(db, "sessions", route.params.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setSession(data.session)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    getSessions()
  }, [])

  if (session === undefined) {
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
    <ScrollView>
      {session && (
        <List.Section key={session.date.toMillis()}>
          <List.Subheader>{`${session.category}, ${session.date
            .toDate()
            .toLocaleDateString()}`}</List.Subheader>
          {session?.excersices &&
            session.excersices.map((exc, idx) => (
              <List.Item
                key={`${exc.excersice}-${idx}`}
                title={exc.excersice}
                description={`${exc.kilo}/${exc.reps}x${exc.sets}`}
              />
            ))}
        </List.Section>
      )}
    </ScrollView>
  )
}
export default SessionItem
