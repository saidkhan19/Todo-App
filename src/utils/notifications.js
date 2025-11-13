import i18n from "@/config/i18n";

export const transformFirebaseError = (error) => {
  const key = `firebase-errors:${error?.code}`;
  const defaultKey = "firebase-errors:default";

  return {
    type: "error",
    message: i18n.exists(key) ? i18n.t(key) : i18n.t(defaultKey),
  };
};
