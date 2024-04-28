import { useState } from "react"
import { View } from "react-native"
import { Button, Text, useTheme } from "react-native-paper"
import { ExcersiceDetails } from "./ExcersiceDetails"
import { z } from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ExcersiceItem from "./ExcersiceItem"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../firebaseConfig"

const ExcersiceSchema = z
  .object({
    excersice: z.string(),
    kilo: z.string(),
    sets: z.string(),
    reps: z.string(),
  })
  .array()

const SessionSchema = z.object({
  category: z.string().min(1, { message: "Please fill in category." }),
  date: z.date().refine((data) => data < new Date(), {
    message: "Date cannot be in the future.",
  }),
  excersices: ExcersiceSchema,
})

export type SessionFormT = z.infer<typeof SessionSchema>
export type ExcersiceFormT = z.infer<typeof ExcersiceSchema>

const defaultValues = (): SessionFormT => ({
  category: "",
  date: new Date(),
  excersices: [
    {
      excersice: "",
      kilo: "",
      sets: "",
      reps: "",
    },
  ],
})

type SessionDialogStep = {
  name: string
  content: React.JSX.Element
}

export const SessionDialog = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const form = useForm<SessionFormT>({
    defaultValues: defaultValues(),
    resolver: zodResolver(SessionSchema),
  })
  const theme = useTheme()

  const category = form.watch("category")
  const date = form.watch("date")

  const steps = (): SessionDialogStep[] => [
    {
      name: "session-category",
      content: <ExcersiceDetails />,
    },
    {
      name: "session-details",
      content: <ExcersiceItem />,
    },
  ]

  const onBack = () => {
    if (currentStep === 0) {
      navigation.goBack()
    } else {
      setCurrentStep((c) => c - 1)
    }
  }

  const onNext = async () => {
    const isStepValid = await form.trigger(["category", "date"])
    if (isStepValid && currentStep === 0) {
      setCurrentStep((c) => c + 1)
    }
  }

  const onSubmit = async (data: SessionFormT) => {
    try {
      const docRef = await addDoc(collection(db, "sessions"), {
        session: {
          ...data,
          excersices: [...data.excersices],
        },
      })
      form.reset()
      navigation.navigate("AddPlan")
      return docRef
    } catch (error) {
      console.error(error)
    }
  }

  const view = () => {
    return (
      <>
        {steps()
          .filter((_s, i) => i === currentStep)
          .map((s, _i) => {
            return (
              <View
                key={s.name}
                style={{
                  display: "flex",
                  flex: 1,
                }}
              >
                {s.content}
              </View>
            )
          })}
      </>
    )
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <FormProvider {...form}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 150,
            marginTop: 24,
          }}
        >
          <Text variant="headlineLarge" style={{ marginBottom: 16 }}>
            Add session
          </Text>
          <Text variant="bodySmall">
            {currentStep === 0
              ? "Please fill in category and date."
              : "Please fill in excersice details to submit."}
          </Text>
        </View>
        {view()}
      </FormProvider>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          alignItems: "center",
          justifyContent: "space-between",
          bottom: 0,
          height: 100,
          width: "100%",
          paddingBottom: 24,
          backgroundColor: theme.colors.surface,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {currentStep === 1 && (
            <Button
              mode="text"
              onPress={() =>
                form.reset({
                  category: category,
                  date: date,
                  excersices: defaultValues().excersices,
                })
              }
              style={{ marginLeft: 16 }}
            >
              {"Reset"}
            </Button>
          )}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            textColor="black"
            mode="outlined"
            onPress={onBack}
            style={{ marginRight: 8 }}
          >
            {currentStep === 0 ? "Close" : "Back"}
          </Button>

          {currentStep === 0 && (
            <Button
              mode="contained"
              style={{ marginRight: 16 }}
              onPress={onNext}
            >
              {"Next"}
            </Button>
          )}
          {currentStep === 1 && (
            <Button
              mode="contained"
              style={{ marginRight: 16 }}
              onPress={form.handleSubmit(onSubmit)}
            >
              {"Save"}
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}
