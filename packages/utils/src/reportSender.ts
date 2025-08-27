function asyncSend(sender: () => void) {
  try {
    if (window?.requestIdleCallback) {
      window.requestIdleCallback(
        () => {
          sender();
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        sender();
      });
    }
  } catch (error) {
    console.error('sender error:', error);
  }
}

function imageSender(url: string, data: Record<string, any>) {
  try {
    const img = new Image();
    img.src = `${url}?data=${encodeURIComponent(JSON.stringify(data))}`;
  } catch (error) {
    console.error('Image sender error:', error);
  }
}

function fetchSender(url: string, data: Record<string, any>) {
  asyncSend(() => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  });
}

function sendBeaconSender(url: string, data: Record<string, any>) {
  asyncSend(() => {
    navigator.sendBeacon(url, JSON.stringify(data));
  });
}

function xhrSender(url: string, data: Record<string, any>) {
  asyncSend(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  });
}

export { imageSender, fetchSender, sendBeaconSender, xhrSender };
