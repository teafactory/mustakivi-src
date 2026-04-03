const POPUP_SELECTOR = '.notifications-popup';
const CLOSE_BUTTON_SELECTOR = '.notifications-popup__close-button';
const CLOSE_ANIMATION_DURATION = 700;
const COOKIE_EXPIRES_DAYS = 1;

const getCookie = (name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const closePopup = (popup, cookieKey) => {
  popup.classList.remove('visible');
  popup.classList.add('hidden');

  window.setTimeout(() => {
    popup.remove();

    if (cookieKey) {
      setCookie(cookieKey, 'true', COOKIE_EXPIRES_DAYS);
    }
  }, CLOSE_ANIMATION_DURATION);
};

const showPopup = (popup, cookieKey) => {
  const closeButton = popup.querySelector(CLOSE_BUTTON_SELECTOR);

  popup.classList.add('visible');

  if (!closeButton) {
    return;
  }

  closeButton.addEventListener('click', () => {
    closePopup(popup, cookieKey);
  });
};

const initNotificationsPopup = () => {
  const popup = document.querySelector(POPUP_SELECTOR);

  if (!popup) {
    return;
  }

  const cookieKey = popup.dataset.key;
  const cookieValue = cookieKey ? getCookie(cookieKey) : null;

  if (cookieValue) {
    popup.remove();
    return;
  }

  showPopup(popup, cookieKey);
};

export default initNotificationsPopup;
