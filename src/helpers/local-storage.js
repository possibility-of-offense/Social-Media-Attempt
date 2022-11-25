export function setLocalStorage(key, info = null) {
  if (info) {
    if (typeof info === "object") {
      localStorage.setItem(key, JSON.stringify(info));
      return;
    }
    localStorage.setItem(key, info);
  }
}

export function getFromLocalStorage(key) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  }
}

export function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}
