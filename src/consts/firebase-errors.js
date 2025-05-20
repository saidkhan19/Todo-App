export const firebaseErrors = {
  "auth/user-not-found": "Пользователь с таким email не найден.",
  "auth/wrong-password": "Неверный пароль.",
  "auth/invalid-email": "Неверный формат email.",
  "auth/user-disabled": "Учетная запись пользователя отключена.",
  "auth/too-many-requests":
    "Слишком много неудачных попыток входа. Доступ временно заблокирован.",
  "auth/email-already-in-use": "Email уже используется другим пользователем.",
  "auth/operation-not-allowed":
    "Вход с помощью email и пароля отключен в консоли Firebase.",
  "auth/weak-password": "Слишком слабый пароль.",
  "auth/account-exists-with-different-credential":
    "Учетная запись с таким email уже существует, но с другим способом входа.",
  "auth/credential-already-in-use":
    "Эти учетные данные уже используются другим пользователем.",
  "auth/popup-closed-by-user":
    "Окно входа было закрыто до завершения авторизации.",
  "auth/popup-blocked": "Браузер заблокировал всплывающее окно входа.",
  "auth/unauthorized-domain": "Домен не авторизован для операций OAuth.",
  "auth/id-token-expired": "Срок действия токена пользователя истек.",
  "auth/id-token-revoked": "Токен пользователя был отозван.",
  "auth/invalid-user-token":
    "Учетные данные пользователя недействительны (например, пользователь удален).",
  "auth/network-request-failed": "Произошла сетевая ошибка.",
  "auth/internal-error": "Внутренняя ошибка. Возможно, неверная конфигурация.",
  "auth/invalid-credential": "Неверные или устаревшие учетные данные.",
  "auth/requires-recent-login":
    "Для этой операции требуется повторный вход в систему.",
};

export const defaultFirebaseError =
  "Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз позже.";
