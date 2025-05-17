import { useState, useCallback } from "react";
import { linkWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth } from "../config/firebase";

const useLinkAnonymousUserWithGoogle = () => {
  const [error, setError] = useState();
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const provider = new GoogleAuthProvider();
      const result = await linkWithPopup(auth.currentUser, provider);
      setLoggedInUser(result.user);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return [signIn, loggedInUser, loading, error];
};

export default useLinkAnonymousUserWithGoogle;
