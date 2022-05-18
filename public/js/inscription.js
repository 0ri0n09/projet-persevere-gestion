const db = firebase.firestore();

const config = {
    apiKey: "AIzaSyDHt321Q9fjJEkTdTt8D7FKLArPLTkrrys",
    authDomain: "persevere-9b1cd.firebaseapp.com",
    databaseURL: "",
    projectId: "persevere-9b1cd",
    storageBucket: "persevere-9b1cd.appspot.com",
    messagingSenderId: "1094027429774",
    appId: "1:1094027429774:web:a44c5364dc15611afd06df",
    measurementId: "G-KERQPT5Q7X"
  };

var secondaryApp = firebase.initializeApp(config, "Secondary");

//Affichage User courant + setName Accueil Header
var nameUser;
firebase.auth().onAuthStateChanged((user) => 
{
    if (user) {
      //console.log(user);
    }

    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            var data = doc.data();
            var role = data.role;
            nameUser = data.name;
            document.getElementById("username").innerHTML = nameUser;
            console.log("nameUSER : "+nameUser);
            
            //Si user est un "user"
            if(role == "user"){
                window.location.href = './accueil.html';
            }
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
      });
});

//Bouton Validation pour ajouter un utilisateur
const validateUser = document.getElementById('validateUser');
validateUser.addEventListener('click', () => {

    const email = document.getElementById('emailU');
    const name = document.getElementById('nameU');
    const phone_number = document.getElementById('phone_numberU');
    const date_inscription = document.getElementById('date_inscriptionU');
    const role = "user";
    const password = makePwd(50);

    secondaryApp.auth().createUserWithEmailAndPassword(email.value, password)
        .then((userCredential) => {
            const userUID = userCredential.user.uid;

            db.collection("users").doc(userUID).set({
                email: email.value,
                id: userUID,
                name: name.value,
                role: role,
                phone_number: phone_number.value,
                date_inscription: date_inscription.value,
            })
            .then(() => {
                console.log("Document written with ID:", userUID);
                secondaryApp.auth().sendPasswordResetEmail(email.value)
                .then(() => {
                    alert("L'email pour la création du mot de passe à été envoyé !");
                })
                .catch(function(error) {
                    alert(error);
                });
                secondaryApp.auth().signOut();
            })
    });
});

//Fonction pour générer un mot de passe aléatoire
function makePwd(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//Déconnexion
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});

