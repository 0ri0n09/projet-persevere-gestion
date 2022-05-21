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

//Remplissage de la liste listeUsers
const usersBoarders = db.collection('users').get();
usersBoarders.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var name = data.name;
        var id = data.id;
        //console.log(id);
        //console.log(name);

        document.getElementById("listeUsers").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Ajouter un pensionnaire
const validateP = document.getElementById('validateP');
validateP.addEventListener('click', () => {

    //Récupération des inputs
    const birthdate = document.getElementById('birthdate');
    const board_price = document.getElementById('board_price');
    const date_inscription = new Date().toLocaleDateString();
    const entry_date = document.getElementById('entry_date');
    const gender = document.getElementById('gender');
    const name = document.getElementById('name');
    const options = document.getElementById('options');
    const race = document.getElementById('race');
    const weight = document.getElementById('weight');
    const id = makePwd(20);

    //Ajout du pensionnaire à la base de données
    db.collection("boarders").doc(id).set({
        id_user: listeUsers.options[listeUsers.selectedIndex].value,
        birthdate: birthdate.value,
        board_price: board_price.value,
        date_inscription: date_inscription,
        entry_date: entry_date.value,
        gender: gender.value,
        name: name.value,
        options: options.value,
        race: race.value,
        weight: weight.value,
        id: id,
    })
    .then(() => {
        
        alert("Le pensionnaire "+ name.value +" a été ajouté");
        birthdate.value = "";
        board_price.value = "";
        entry_date.value = "";
        gender.value = "";
        name.value = "";
        options.value = "";
        race.value = "";
        weight.value = "";
        location.reload();
    })
    .catch((error) => {
        alert(error);
    });
});

//Remplissage liste des Users Modifier
const usersBoardersM = db.collection('users').get();
usersBoardersM.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var name = data.name;
        var id = data.id;

        document.getElementById("usersModifierListe").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Remplissage liste des Boarders modifier selon le user selectionné
const usersModifierListe = document.getElementById('usersModifierListe');
usersModifierListe.addEventListener('click', () => {

    var boardersModifierListe = document.getElementById('boardersModifierListe');
    var idUserModifier = usersModifierListe.options[usersModifierListe.selectedIndex].value;

    //Clean
    for (var i=0; i < boardersModifierListe.length; i++) {
        boardersModifierListe.remove(i);
        boardersModifierListe.remove(selectedIndex);
    }
    
    const boarders = db.collection('boarders').get();
    boarders.then((snap) => {
        snap.docs.forEach((doc) => {

            var data = doc.data();
            var name = data.name;
            var id_user = data.id_user;
            var id = data.id;

            console.log("ID CHEVAL = " + id);
    
            if(id_user == idUserModifier){
                document.getElementById("boardersModifierListe").innerHTML += `
                    <option value="${id}">${name}</option>
                `;
            }
        })
    });
});


//Modification des informations
var idUserModifier;
const modifierU = document.getElementById('modifierU');
const listeUsersModifier = document.getElementById('listeUsersModifier');

//Pré-remplissage des champs
// listeUsersModifier.addEventListener('change', () => {
//     idUserModifier = listeUsersModifier.options[listeUsersModifier.selectedIndex].value;

//     var docRef = db.collection("users").doc(idUserModifier);
//     docRef.get().then((doc) => {
//         if (doc.exists) 
//         {
//             var data = doc.data();
//             var name = data.name;
//             var phone_number = data.phone_number;
//             var adresse = data.adresse;
//             var ville = data.ville;
//             var code_postal = data.code_postal;

//             document.getElementById('nameUserModifier').value = name;
//             document.getElementById('phone_numberUserModifier').value = phone_number;
//             document.getElementById('adresseUserModifier').value = adresse;
//             document.getElementById('villeUserModifier').value = ville;
//             document.getElementById('postalUserModifier').value = code_postal;
//             document.forms[0].submit();
            
//         } else {
//             console.log("No such document!");
//         }
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//     });
// });

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

