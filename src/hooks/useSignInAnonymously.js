import { useCallback, useState } from "react";
import { signInAnonymously } from "firebase/auth";

import { auth } from "../config/firebase";

const useSignInAnonymously = () => {
  const [error, setError] = useState();
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await signInAnonymously(auth);
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

export default useSignInAnonymously;
