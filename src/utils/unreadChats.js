const STORAGE_KEY = 'socially_unread_chats';

export const getUnreadChatIds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const ids = JSON.parse(stored);
    return new Set(ids);
  } catch (error) {
    return new Set();
  }
};

export const saveUnreadChatIds = (chatIds) => {
  try {
    const idsArray = Array.from(chatIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(idsArray));
  } catch (error) {
    console.error('Failed to save unread chats:', error);
  }
};

export const addUnreadChatId = (chatId) => {
  const unreadIds = getUnreadChatIds();
  unreadIds.add(chatId);
  saveUnreadChatIds(unreadIds);
  return unreadIds;
};

export const removeUnreadChatId = (chatId) => {
  const unreadIds = getUnreadChatIds();
  unreadIds.delete(chatId);
  saveUnreadChatIds(unreadIds);
  return unreadIds;
};

export const clearUnreadChatIds = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return new Set();
  } catch (error) {
    console.error('Failed to clear unread chats:', error);
    return new Set();
  }
};

