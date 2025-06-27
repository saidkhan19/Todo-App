import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";

import { auth } from "../../config/firebase";
import { AuthContext } from "./context";
import useSignInAnonymously from "../../hooks/useSignInAnonymously";
import useLinkAnonymousUserWithGoogle from "../../hooks/useLinkAnonymousUserWithGoogle";
import useFirebaseErrorNotification from "../../hooks/useFirebaseErrorNotification";

const AuthProvider = ({ children }) => {
  const [user, isUserLoading, userError] = useAuthState(auth);

  const [signInWithGoogle, _gUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInAnonymously, _aUser, anonLoading, anonError] =
    useSignInAnonymously();
  const [linkAnonymousUser, _lUser, linkLoading, linkError] =
    useLinkAnonymousUserWithGoogle();
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);

  useFirebaseErrorNotification(userError);
  useFirebaseErrorNotification(googleError);
  useFirebaseErrorNotification(anonError);
  useFirebaseErrorNotification(linkError);
  useFirebaseErrorNotification(signOutError);

  const isLoading =
    isUserLoading ||
    googleLoading ||
    anonLoading ||
    linkLoading ||
    signOutLoading;

  const handleRegisterWithGoogle = async () => {
    let userCredentials;
    if (user?.isAnonymous) {
      userCredentials = await linkAnonymousUser();
    } else {
      userCredentials = await signInWithGoogle();
    }
    return userCredentials;
  };

  const handleSignInAnonymously = async () => await signInAnonymously();

  const handleSignOut = () => signOut();

  const value = {
    user,
    isLoading,
    handleRegisterWithGoogle,
    handleSignInAnonymously,
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
