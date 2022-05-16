
const db = firebase.firestore();
//db.settings({timestampInSnapshots : true});
const users = db.collection('users').get();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // if the users are not signed in, we redirect them to the signin form
        console.log("CONNECTE =   "+ user.uid);
        console.log("EMAIL =   "+ user.email);
        console.log("NAME =   "+ user.name);
        
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

var nameUser;
firebase.auth().onAuthStateChanged((user) => 
{
    if (user) {
      console.log(user)
    }
    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());

            var data = doc.data();
            nameUser = data.name;
            document.getElementById("username").innerHTML = nameUser;
            console.log("nameUSER : "+nameUser);
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
      });
});

const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});
                    