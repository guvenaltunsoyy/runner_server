'use strict'
const functions = require('firebase-functions');
const admin=require('firebase-admin')
admin.initializeApp(functions.config().firebase);
exports.sendNotification=functions.database.ref('/Notification/{receiver_user_id}/{notification_id}')
.onWrite((data,context)=>{
    const receiver_user_id=context.params.receiver_user_id;
    const notification_id=context.params.notification_id;

    console.log('we have a notification to send to: ',receiver_user_id);

    if (!data.after.val()) {
        console.log('a notification has been deleted: ',notification_id);
        return null;
    }
    const DeviceToken=admin.database().ref(`/Users/${receiver_user_id}/`)
});
