import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
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
import { SnackbarT } from "app"

const SignInSchema = z
  .object({
    email: z.string().email({ message: "Email must be valid." }),
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Your password must contain at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesnt match",
    path: ["confirmPassword"],
  })

type FormT = z.infer<typeof SignInSchema>

export const SignUpPage = ({ navigation }) => {
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarT>("none")

  const auth = getAuth(app)

  const form = useForm<FormT>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignInSchema),
  })

  const handleSignUp = async ({ email, password, confirmPassword }: FormT) => {
    try {
      if (password === confirmPassword) {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      console.error(error)
      setShowSnackbar("error")
    }
  }

  const onSubmit = (data: FormT) => {
    handleSignUp(data)
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
        <Snackbar
          visible={showSnackbar === "success"}
          onDismiss={() => setShowSnackbar("success")}
          wrapperStyle={{ top: 0 }}
          style={{ backgroundColor: "green" }}
        >
          {"User created!"}
        </Snackbar>
        <Text variant="headlineLarge" style={{ marginBottom: 16 }}>
          Sign up
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
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Confirm password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              style={{ marginBottom: 16, width: "100%" }}
              mode="outlined"
              label="Confirm password"
            />
          )}
        />
        {form.formState.errors?.confirmPassword && (
          <HelperText type="error" style={{ marginBottom: 8 }}>
            {form.formState.errors.confirmPassword.message}
          </HelperText>
        )}
        {form.formState.errors?.root && (
          <HelperText type="error" style={{ marginBottom: 8 }}>
            {form.formState.errors.root.message}
          </HelperText>
        )}
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Button
            mode="contained"
            onPress={form.handleSubmit(onSubmit, (error) => console.log(error))}
            style={{ marginBottom: 16 }}
          >
            Sign up
          </Button>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text>Already havea an account?</Text>
            <Button mode="text" onPress={() => navigation.navigate("SignIn")}>
              Sign in
            </Button>
          </View>
        </View>
      </View>
    </FormProvider>
  )
}
