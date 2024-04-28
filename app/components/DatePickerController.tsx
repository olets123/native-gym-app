import { useState } from "react"
import {
  Control,
  Controller,
  FieldValues,
  Path,
  get,
  useFormState,
} from "react-hook-form"
import DatePicker from "react-native-date-picker"
import { HelperText, TextInput } from "react-native-paper"

interface DatePickerControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  value: string
}

export const DatePickerController = <TFieldValues extends FieldValues>({
  control,
  name,
  value,
}: DatePickerControllerProps<TFieldValues>) => {
  const [open, setOpen] = useState<boolean>(false)
  const { errors } = useFormState()
  const error = get(errors, name)
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <TextInput
              mode="outlined"
              label="Date"
              value={value}
              error={error}
              right={
                <TextInput.Icon
                  icon="calendar"
                  size={20}
                  onPress={() => setOpen(true)}
                />
              }
            />
            <DatePicker
              modal={true}
              open={open}
              mode="date"
              date={field.value ?? new Date()}
              onCancel={() => setOpen(false)}
              onConfirm={(date) => {
                console.log("date:", date)
                field.onChange(date)
                setOpen(false)
              }}
            />
          </>
        )}
      />
      {error && (
        <HelperText type="error" style={{ marginTop: 8 }}>
          {error.message}
        </HelperText>
      )}
    </>
  )
}
export default DatePickerController
