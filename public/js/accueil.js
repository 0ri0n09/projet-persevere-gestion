
const db = firebase.firestore();

//GetAllUsers
const users = db.collection('users').get();
users.then((snap) => {
    snap.docs.forEach((doc) => {
        console.log(doc);
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
                    