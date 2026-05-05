//Global notification context for showing messages across the app.
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext<any>(null);

export function NotificationProvider({ children }: any) {
  const [messages, setMessages] = useState([]);

  const notify = (msg: any) => {
    setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
    setTimeout(() => {
      setMessages((prev) => prev.slice(1));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationTray messages={messages} />
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);