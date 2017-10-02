var authUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        authUser = user;
        $('#name').text(user.displayName);
        $('#email').text(user.email);
        $('#photo').attr('src', user.photoURL);
    } else {
        window.location.href = "index.html";
    }
});

function signOut() {
    firebase.auth().signOut();
}

function send() {
    var messageObj = {};

    messageObj.message = $('#message').val();
    messageObj.sender = authUser.displayName;
    messageObj.photoURL = authUser.photoURL;

    var messageRef = firebase.database().ref('messages').push();
    messageRef.set(messageObj);
}

var messagesRef = firebase.database().ref('messages');


messagesRef.on('child_added', function(data) {
    addMessageElement(data.key, data.val());
});

messagesRef.on('child_removed', function(data) {
    updateUI(data.key);
});

function updateUI(key) {
    $('#' + key).remove();
}


function addMessageElement(key, data) {
    //var e = key;
    var element = '<li class="collection-item avatar" id=\'' + key + '\'>' +
        '<img src= "' + data.photoURL + '" alt= "" class="circle" >' +
        '<span class="title">' + data.sender + '</span>' +
        '<p>' + data.message + ' <button class="btn"  onclick= ' + '"deleteElement(\'' + key + '\');"' + ' > delete </button>' +
        '</p>'
    '</li>';
    $('#collection').prepend(element);
}

function deleteElement(data) {
    console.log(data);
    messagesRef.child(data).remove();
}