const db = firebase.firestore();

//Affichage User courant + setName Accueil Header
var nameUser;
firebase.auth().onAuthStateChanged((user) => 
{
    if (user) {
      //console.log(user)
    }
    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then((doc) => {
        if (doc.exists) {
            //console.log("Document data:", doc.data());
            var data = doc.data();
            var role = data.role;
            nameUser = data.name;
            document.getElementById("username").innerHTML = nameUser;
            //console.log("nameUSER : "+nameUser);
            
            //Si user est un "admin"
            if(role == "user"){
                window.location.href = './accueil.html';
            }

            //Si user est un "pro"
            if(role == "pro"){
                window.location.href = './accueil_pro.html';
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
      });
});

//Remplissage de listeUsers
const users = db.collection('users').get();
users.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var name = data.name;
        var id = data.id;

        document.getElementById("listeUsers").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Remplissage liste des pensionnaires selon le user selectionné
const listeUsers = document.getElementById('listeUsers');
listeUsers.addEventListener('click', () => {

    var listeBoarders = document.getElementById('listeBoarders');
    var idUserSelect = listeUsers.options[listeUsers.selectedIndex].value;

    //Clean de liste des pensionnaires quand un user est sélectionné
    for (var i=0; i < listeBoarders.length; i++) {
        listeBoarders.remove(i);
        listeBoarders.remove(0);
    }
    
    listeBoarders.selectedIndex = 0;

    const boarders = db.collection('boarders').get();
    boarders.then((snap) => {
        snap.docs.forEach((doc) => {

            var data = doc.data();
            var name = data.name;
            var id_user = data.id_user;
            var id = data.id;
    
            if(id_user == idUserSelect){
                document.getElementById("listeBoarders").innerHTML += `
                    <option value="${id}">${name}</option>
                `;
            }
        })
    });
});

//Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});