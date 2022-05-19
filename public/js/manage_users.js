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

//Affichage User courant et affichage du nom dans le header
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
            //console.log("nameUSER : "+nameUser);
            
            //Si user est un "user"
            if(role == "user"){
                window.location.href = './accueil.html';
            }

            //Si user est un "pro"
            if(role == "user"){
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

//Bouton Validation pour ajouter un utilisateur
const validateUser = document.getElementById('validateUser');
validateUser.addEventListener('click', () => {

    //Récupération des inputs
    const email = document.getElementById('emailU');
    const name = document.getElementById('nameU');
    const phone_number = document.getElementById('phone_numberU');
    const adresse = document.getElementById('adresseU');
    const code_postal = document.getElementById('postalU');
    const ville = document.getElementById('villeU');
    const date_inscription = new Date().toLocaleDateString();
    const role = "user";
    const password = makePwd(50);

    //Ajout du user à la base de données (Authentification)
    secondaryApp.auth().createUserWithEmailAndPassword(email.value, password)
        .then((userCredential) => {
            const userUID = userCredential.user.uid;
            
            //Ajout du user à la base de données
            db.collection("users").doc(userUID).set({
                email: email.value,
                id: userUID,
                name: name.value,
                role: role,
                phone_number: phone_number.value,
                date_inscription: date_inscription,
                adresse: adresse.value,
                code_postal: code_postal.value,
                ville: ville.value,
            })
            .then(() => {
                console.log("Document written with ID:", userUID);
                //Envoie de la réinitialisation du mot de passe à l'email du user
                secondaryApp.auth().sendPasswordResetEmail(email.value)
                .then(() => {
                    alert("L'email pour la création du mot de passe à été envoyé !");
                    email.value = "";
                    name.value = "";
                    phone_number.value = "";
                    adresse.value = "";
                    code_postal.value = "";
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

