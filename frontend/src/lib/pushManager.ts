export async function registerPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered:', registration);

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return;
    }

    const publicVapidKey = 'BEnN9h8ldd3HGMSr4S63ZwWPfCMjN8c7J40ZjO5k9tTxXOO24Vwes-U3j3p9GHfjZ3Y02lowOM1zXmYBLat89gw';
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    const token = localStorage.getItem('sb-bmmtejkcxkfixqnbglgu-auth-token'); 
    const session = token ? JSON.parse(token) : null;

    await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ subscription }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      }
    });

    console.log('Push subscription saved to server');
  } catch (err) {
    console.error('Push registration failed:', err);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
