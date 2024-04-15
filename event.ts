enum EventTypeEnum {
  Login = "login",
  Logout = "logout",
}

interface EventPayload {
  login: { user: string; sessionId: string };
  logout: { user: string };
}

type EventType = EventTypeEnum.Login | EventTypeEnum.Logout;
type EventListenerCustom<T> = (payload: T) => void;

const listeners: { [K in EventType]?: EventListenerCustom<EventPayload[K]>[] } =
  {};
function registerListener<T extends EventType>(
  type: T,
  listener: EventListenerCustom<EventPayload[T]>
): void {
  listeners[type] = listeners[type] || [];
  listeners[type]!.push(listener);
}

function unregisterListener<T extends EventType>(
  type: T,
  listener: EventListenerCustom<EventPayload[T]>
): void {
  if (listeners[type]) {
    // Cast the filter result explicitly to the correct listener type
    listeners[type] = listeners[type]!.filter(
      (l) => l !== listener
    ) as EventListenerCustom<EventPayload[T]>[] as any;
  }
}

function dispatchEventCustom<T extends EventType>(
  type: T,
  payload: EventPayload[T]
) {
  if (listeners[type]) {
    listeners[type]!.forEach((listener) => listener(payload));
  }
}

// Define listeners
const onLogin = (payload: { user: string; sessionId: string }) => {
  console.log(`Login: User ${payload.user}, Session ID: ${payload.sessionId}`);
};
const onLogout = (payload: { user: string }) => {
  console.log(`Logout: User ${payload.user}`);
};

// Register listeners
registerListener(EventTypeEnum.Login, onLogin);
registerListener(EventTypeEnum.Logout, onLogout);

// Dispatch events
dispatchEventCustom(EventTypeEnum.Login, { user: "admin", sessionId: "123" });
dispatchEventCustom(EventTypeEnum.Logout, { user: "admin" });

// Unregister the login listener and test dispatching again
unregisterListener(EventTypeEnum.Login, onLogin);
dispatchEventCustom(EventTypeEnum.Login, { user: "admin", sessionId: "456" }); // This should not log anything
