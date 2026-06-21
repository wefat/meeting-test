import liff from '@line/liff';

export const initLiff = async () => {
  try {
    await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "2010463948-rBhjBAAD" });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
    return liff;
  } catch (error) {
    console.error('LIFF init failed', error);
    return null;
  }
};
