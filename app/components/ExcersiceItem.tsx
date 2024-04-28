import { View } from "react-native"
import { Button, IconButton, MD3Colors } from "react-native-paper"
import { FormProvider, useFieldArray, useFormContext } from "react-hook-form"
import { SessionFormT } from "./SessionDialog"
import TextInputController from "./TextInputController"

export const ExcersiceItem = () => {
  const form = useFormContext<SessionFormT>()
  const { fields, append } = useFieldArray<SessionFormT>({
    control: form.control,
    name: "excersices",
  })

  const onAppendExcersice = () => {
    append({ excersice: "", kilo: "", sets: "", reps: "" })
  }

  return (
    <FormProvider {...form}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: 16,
        }}
      >
        {fields.map((field, index) => (
          <View
            key={field.id}
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              width: "100%",
              padding: 0,
            }}
          >
            <TextInputController
              control={form.control}
              name={`excersices.${index}.excersice`}
              label="Excersice"
              style={{ marginRight: 8, width: "30%" }}
            />
            <TextInputController
              control={form.control}
              keyboardType="numeric"
              name={`excersices.${index}.kilo`}
              label="KG"
              style={{ marginRight: 8, width: "25%" }}
            />
            <TextInputController
              control={form.control}
              name={`excersices.${index}.sets`}
              keyboardType="numeric"
              label="Sets"
              style={{ marginRight: 8, width: "20%" }}
            />
            <TextInputController
              control={form.control}
              name={`excersices.${index}.reps`}
              keyboardType="numeric"
              label="Reps"
              style={{ width: "20%", marginRight: 8 }}
            />
          </View>
        ))}
        <View
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <IconButton mode="outlined" icon="plus" onPress={onAppendExcersice} />
        </View>
      </View>
    </FormProvider>
  )
}
export default ExcersiceItem
