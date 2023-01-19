export function createNotification(title, options) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
    } else if (Notification.permission === "granted") {
        // If the user has granted permission, create a notification
        let notification = new Notification(title, options);
        let sound = new Audio(options.sound);
        sound.play();
    } else if (Notification.permission !== "denied") {
        // If the user has not yet granted or denied permission, ask for permission
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                let notification = new Notification(title, options);
                let sound = new Audio(options.sound);
                sound.play();
            }
        });
    }
}
