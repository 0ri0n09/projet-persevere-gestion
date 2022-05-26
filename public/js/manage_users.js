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

//Ajouter un utilisateur
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
                
                //Envoi de la réinitialisation du mot de passe à l'email du user
                secondaryApp.auth().sendPasswordResetEmail(email.value)
                .then(() => {
                    alert("Utilisateur a été ajouté | L'email pour la création du mot de passe à été envoyé !");
                    email.value = "";
                    name.value = "";
                    phone_number.value = "";
                    adresse.value = "";
                    code_postal.value = "";
                    location.reload();
                })
                .catch(function(error) {
                    alert(error);
                });
                secondaryApp.auth().signOut();
            })
    }).catch(function(error) {
        alert("Veuillez entrer un email au format valide");
    });
});

//Remplissage liste des Users delete
const users = db.collection('users').get();
users.then((snap) => {
    snap.docs.forEach((doc) => {

        var data = doc.data();
        var name = data.name;
        var id = data.id;
        var role = data.role;
  
        if(role == "user"){
            document.getElementById("listeU").innerHTML += `
                <option value="${id}">${name}</option>
            `;
        }
    })
});

//Suppression d'un user
const deleteU = document.getElementById('deleteU');
deleteU.addEventListener('click', () => {
    var idUser = listeU.options[listeU.selectedIndex].value;

    //Suppresion de la base de donnée
    db.collection("users").doc(idUser).delete().then(() => {
        alert("L'utilisateur à bien été supprimé");
        location.reload();
    }).catch((error) => {
        alert.error("Error removing document: ", error);
    });
});

//Remplissage liste des Users Modifier
const users2 = db.collection('users').get();
users2.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var name = data.name;
        var id = data.id;
        var role = data.role;
        //console.log(id);
        //console.log(name);

        if(role == "user"){
            document.getElementById("listeUsersModifier").innerHTML += `
                <option value="${id}">${name}</option>
            `;
        }
    })
});

//Modification du mot de passe
const modifierPassword = document.getElementById('modifierPassword');
modifierPassword.addEventListener('click', () => {

    var idUser = listeUsersModifier.options[listeUsersModifier.selectedIndex].value;

    users2.then((snap) => {
        snap.docs.forEach((doc) => {
            var data = doc.data();
            var email = data.email;
            var id = data.id;
            if(idUser == id)
            {
                secondaryApp.auth().sendPasswordResetEmail(email)
                .then(() => {
                    alert("L'email pour la réinitialisation du mot de passe à été envoyé !");
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
var idUserModifier;
const modifierU = document.getElementById('modifierU');
const listeUsersModifier = document.getElementById('listeUsersModifier');

//Pré-remplissage des champs
listeUsersModifier.addEventListener('change', () => {
    idUserModifier = listeUsersModifier.options[listeUsersModifier.selectedIndex].value;

    var docRef = db.collection("users").doc(idUserModifier);
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
            document.forms[0].submit();
            
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});

//Update des informations
modifierU.addEventListener('click', () => {

    idUserModifier = listeUsersModifier.options[listeUsersModifier.selectedIndex].value;
    var name = document.getElementById('nameUserModifier').value;
    var phone_number = document.getElementById('phone_numberUserModifier').value;
    var adresse = document.getElementById('adresseUserModifier').value;
    var ville = document.getElementById('villeUserModifier').value;
    var code_postal = document.getElementById('postalUserModifier').value;

    db.collection("users").doc(idUserModifier).update({
        name: name,
        phone_number: phone_number,
        adresse: adresse,
        ville: ville,
        code_postal: code_postal,
    })
    .then(() => {
        alert("Les informations de l'utilisateur ont bien été modifiées !");
        location.reload();
    })
    .catch(function(error) {
        alert(error);
    });
});

//Générer un mot de passe aléatoire
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

