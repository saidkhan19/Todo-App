import { useAuthState } from "react-firebase-hooks/auth";

import { getGoogleProfile } from "@/utils/firebase";

const useUserDetails = (auth) => {
  const [user] = useAuthState(auth);
  const googleProfile = getGoogleProfile(user);

  const photoURL = googleProfile.photoURL || "/default-user.jpg";
  const name = googleProfile.displayName || `ID: ${user.uid}`;
  const email = googleProfile.email || "";

  return { photoURL, name, email };
};

export default useUserDetails;
