const db = firebase.firestore();

//Affichage User courant + setName Accueil Header
var nameUser;
var idUserCurrent;
var email;
firebase.auth().onAuthStateChanged((user) => 
{
    if (user) {
      idUserCurrent = user.uid;
      //console.log(idUserCurrent);
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

//Envoie du mail à l'administrateur
const send = document.getElementById('send');
send.addEventListener('click', () => {

    var url="mailto:"+encodeURIComponent("jojo2209@live.fr")
            +"?subject="+encodeURIComponent(document.getElementById("sujet").value)
            +"&body="+encodeURIComponent(document.getElementById("message").value);
    document.location=url;
    location.reload();
});

//Déconnexion 
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});


