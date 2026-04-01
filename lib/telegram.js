export const initTelegram = () => {
  if (typeof window !== 'undefined' && window.Telegram) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const getTelegramUser = () => {
  const tg = initTelegram();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
};

export const getTelegramInitData = () => {
  const tg = initTelegram();
  if (tg) {
    return tg.initData;
  }
  return null;
};

export const closeTelegramApp = () => {
  const tg = initTelegram();
  if (tg) {
    tg.close();
  }
};

export const showTelegramAlert = (message) => {
  const tg = initTelegram();
  if (tg) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
};

export const showTelegramConfirm = (message) => {
  const tg = initTelegram();
  if (tg) {
    return new Promise((resolve) => {
      tg.showConfirm(message, resolve);
    });
  } else {
    return Promise.resolve(confirm(message));
  }
};
