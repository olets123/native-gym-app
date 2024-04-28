import { zodResolver } from "@hookform/resolvers/zod"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "../../firebaseConfig"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { View } from "react-native"
import {
  Button,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper"
import React from "react"
import { SnackbarT } from "@app/index"

const SignInSchema = z.object({
  email: z.string().email({ message: "Email must be valid." }),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." }),
})

type FormT = z.infer<typeof SignInSchema>

export const SignInPage = ({ navigation }) => {
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarT>("none")
  const auth = getAuth(app)

  const form = useForm<FormT>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInSchema),
  })

  const handleSignIn = async (form: FormT) => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
    } catch (e) {
      console.error(e)
      setShowSnackbar("error")
    }
  }

  const onSubmit = (data: FormT) => {
    handleSignIn(data)
  }

  return (
    <FormProvider {...form}>
      <View
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Snackbar
          visible={showSnackbar === "error"}
          onDismiss={() => setShowSnackbar("error")}
          wrapperStyle={{ top: 0 }}
          style={{ backgroundColor: "red" }}
        >
          {"Error! Could not create user.."}
        </Snackbar>
        <Text variant="headlineLarge" style={{ marginBottom: 16 }}>
          Welcome to login
        </Text>
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Email"
              value={field.value}
              onChangeText={field.onChange}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: 16, width: "100%" }}
              mode="outlined"
              label="Email"
            />
          )}
        />
        {form.formState.errors?.email && (
          <HelperText type="error" style={{ marginBottom: 8 }}>
            {form.formState.errors.email.message}
          </HelperText>
        )}
        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              style={{ marginBottom: 16, width: "100%" }}
              mode="outlined"
              label="Password"
            />
          )}
        />
        {form.formState.errors?.password && (
          <HelperText type="error" style={{ marginBottom: 8 }}>
            {form.formState.errors.password.message}
          </HelperText>
        )}
        <View
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <Button
            mode="contained"
            onPress={form.handleSubmit(onSubmit)}
            style={{ marginBottom: 16, width: "100%" }}
          >
            Sign in
          </Button>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Not signed up yet?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("SignUp")}
              style={{ margin: 0 }}
            >
              Sign up
            </Button>
          </View>
        </View>
      </View>
    </FormProvider>
  )
}
