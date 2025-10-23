import { useState, useEffect } from 'react';

const ACTIVE_TAB_KEY = 'JibberActiveTab';

export const useTabSession = (): boolean => {
  const [isSessionActiveElsewhere, setIsSessionActiveElsewhere] = useState(false);

  useEffect(() => {
    const tabId = Date.now().toString();
    localStorage.setItem(ACTIVE_TAB_KEY, tabId);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVE_TAB_KEY && e.newValue !== tabId) {
        setIsSessionActiveElsewhere(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return isSessionActiveElsewhere;
};
