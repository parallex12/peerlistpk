import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "@react-native-firebase/auth";

interface SignInProps {
  email: string;
  password: string;
}

export const SignIn = async ({ email, password }: SignInProps) => {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

export const SignUp = async ({ email, password }: SignInProps) => {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

export const RecoverForgotPass = async ({ email }: { email: string }) => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email)
    .then((res) => {
      console.log(res)
      alert("Password reset link sent. Check you email.");
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

export const SignOut = async () => {
  const auth = getAuth();
  await signOut(auth);
};
