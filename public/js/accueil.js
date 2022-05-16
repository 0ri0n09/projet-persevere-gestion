
const db = firebase.firestore();
//db.settings({timestampInSnapshots : true});
const users = db.collection('users').get();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // if the users are not signed in, we redirect them to the signin form
        console.log("CONNECTE =   "+ user.uid);
        console.log("DISPLAY =   "+ user.displayName);
        
  /*user.updateProfile({
    displayName: "Mr.YOLO",
    photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then(() => {
    // Update successful
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });*/
        
    }
});


users.then((snap) => {
    snap.docs.forEach((doc) => {
        console.log(doc.id);
    })
});


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("username").innerHTML = user.email;

    }
});

const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});

                    