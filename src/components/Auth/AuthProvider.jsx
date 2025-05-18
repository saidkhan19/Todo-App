import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";

import { auth } from "../../config/firebase";
import { AuthContext } from "./store";
import useSignInAnonymously from "../../hooks/useSignInAnonymously";
import useLinkAnonymousUserWithGoogle from "../../hooks/useLinkAnonymousUserWithGoogle";
import PropTypes from "prop-types";

const AuthProvider = ({ children }) => {
  const [user, isUserLoading] = useAuthState(auth);

  const [signInWithGoogle, _gUser, googleLoading, _googleError] =
    useSignInWithGoogle(auth);
  const [signInAnonymously, _aUser, anonLoading, _anonError] =
    useSignInAnonymously();
  const [linkAnonymousUser, _lUser, linkLoading, _linkError] =
    useLinkAnonymousUserWithGoogle();
  const [signOut, signOutLoading, _signOutError] = useSignOut(auth);

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

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
