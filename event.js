var EventTypeEnum;
(function (EventTypeEnum) {
    EventTypeEnum["Login"] = "login";
    EventTypeEnum["Logout"] = "logout";
})(EventTypeEnum || (EventTypeEnum = {}));
var listeners = {};
function registerListener(type, listener) {
    listeners[type] = listeners[type] || [];
    listeners[type].push(listener);
}
function unregisterListener(type, listener) {
    if (listeners[type]) {
        // Cast the filter result explicitly to the correct listener type
        listeners[type] = listeners[type].filter(function (l) { return l !== listener; });
    }
}
function dispatchEventCustom(type, payload) {
    if (listeners[type]) {
        listeners[type].forEach(function (listener) { return listener(payload); });
    }
}
// Define listeners
var onLogin = function (payload) {
    console.log("Login: User ".concat(payload.user, ", Session ID: ").concat(payload.sessionId));
};
var onLogout = function (payload) {
    console.log("Logout: User ".concat(payload.user));
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
