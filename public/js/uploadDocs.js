const db = firebase.firestore();

//Affichage User courant + setName Accueil Header
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
            //console.log("nameUSER : "+nameUser);
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
      });
});

//Liste
//GetAllUsers
const users = db.collection('users').get();
users.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var allUsersName = data.password;
        //console.log(allUsersName);
        document.getElementById("liste").innerHTML += `
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${allUsersName}</a>
        </li>`;
    })
});

//Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});