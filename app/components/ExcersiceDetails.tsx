import { FormProvider, useFormContext } from "react-hook-form"
import { View } from "react-native"
import DatePickerController from "./DatePickerController"
import { SessionFormT } from "./SessionDialog"
import TextInputController from "./TextInputController"

export const ExcersiceDetails = () => {
  const form = useFormContext<SessionFormT>()
  const date = form.watch("date").toDateString()
  return (
    <FormProvider {...form}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          padding: 16,
        }}
      >
        <View>
          <TextInputController
            control={form.control}
            name="category"
            label="Category"
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <DatePickerController
            control={form.control}
            name="date"
            value={date}
          />
        </View>
      </View>
    </FormProvider>
  )
}
