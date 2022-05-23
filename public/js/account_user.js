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
        //console.log(user.uid);
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

    //Modification du mot de passe
    const modifierPassword = document.getElementById('modifierPassword');
    modifierPassword.addEventListener('click', () => {
        var users2 = db.collection('users').get();
        users2.then((snap) => {
            snap.docs.forEach((doc) => {
                var data = doc.data();
                var email = data.email;
                var id = data.id;

                if(user.uid == id)
                {
                    secondaryApp.auth().sendPasswordResetEmail(email)
                    .then(() => {
                        alert("L'email pour la réinitialisation de votre mot de passe à été envoyé !");
                    })
                    .catch(function(error) {
                        alert(error);
                    });
                    secondaryApp.auth().signOut();
                }
            })
        });
    });
        
    //Modification des informations
    const modifierU = document.getElementById('modifierU');
    const listeUsersModifier = document.getElementById('listeUsersModifier');
    //Pré-remplissage des champs;
    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then((doc) => {
        if (doc.exists) 
        {
            var data = doc.data();
            var name = data.name;
            var phone_number = data.phone_number;
            var adresse = data.adresse;
            var ville = data.ville;
            var code_postal = data.code_postal;

            document.getElementById('nameUserModifier').value = name;
            document.getElementById('phone_numberUserModifier').value = phone_number;
            document.getElementById('adresseUserModifier').value = adresse;
            document.getElementById('villeUserModifier').value = ville;
            document.getElementById('postalUserModifier').value = code_postal;
            
        } else {
            console.log("No such document!");
        }
        }).catch((error) => {
            console.log("Error getting document:", error);
    });

    //Update des informations
    modifierU.addEventListener('click', () => {
        var name = document.getElementById('nameUserModifier').value;
        var phone_number = document.getElementById('phone_numberUserModifier').value;
        var adresse = document.getElementById('adresseUserModifier').value;
        var ville = document.getElementById('villeUserModifier').value;
        var code_postal = document.getElementById('postalUserModifier').value;

        db.collection("users").doc(user.uid).update({
            name: name,
            phone_number: phone_number,
            adresse: adresse,
            ville: ville,
            code_postal: code_postal,
        })
        .then(() => {
            alert("Vos informations ont bien été modifiées !");
            location.reload();
        })
        .catch(function(error) {
            alert(error);
        });
    });
});

//Déconnexion
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});

