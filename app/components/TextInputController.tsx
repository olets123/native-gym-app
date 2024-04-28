import {
  Control,
  Controller,
  FieldValues,
  Path,
  get,
  useFormState,
} from "react-hook-form"
import { KeyboardTypeOptions, StyleProp, TextStyle } from "react-native"
import { HelperText, TextInput } from "react-native-paper"

interface TextInputControllerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  style?: StyleProp<TextStyle>
}

export const TextInputController = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  autoCapitalize,
  style,
}: TextInputControllerProps<TFieldValues>) => {
  const { errors } = useFormState()
  const error = get(errors, name)
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            value={field.value}
            onChangeText={field.onChange}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            style={style}
            mode="outlined"
            label={label}
            error={error}
          />
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
export default TextInputController
