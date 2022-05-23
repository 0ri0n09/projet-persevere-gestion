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
            //console.log("Document data:", doc.data());
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

//Ajouter une installation
const validateAddI = document.getElementById('validateAddI');
validateAddI.addEventListener('click', () => {

    //Récupération des inputs de addInstallation
    const nameAddI = document.getElementById('nameAddI');
    const numberAddI = document.getElementById('numberAddI');
    const adresseAddI = document.getElementById('adresseAddI');
    const free = disponibiliteAddI.options[disponibiliteAddI.selectedIndex].value;
    const idI = makePwd(20);
  
    //Ajout de l'installation à la base de données
    db.collection("installations").doc(idI).set({
        name: nameAddI.value,
        number: numberAddI.value,
        adresse: adresseAddI.value,
        free: free,
        id: idI,
    })
    .then(() => {

            alert("L'installation a été ajouté");
            nameAddI.value = "";
            numberAddI.value = "";
            adresseAddI.value = "";

            location.reload();
        })
        .catch(function(error) {
            alert(error);
        });
});

//Remplissage liste des Installations Modifier
const installations = db.collection('installations').get();
installations.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var name = data.name;
        var idI = data.id;

        document.getElementById("listeModifierI").innerHTML += `
            <option value="${idI}">${name}</option>
        `;
    })
});
       
//Modification des informations
//Pré-remplissage des champs
const disponibiliteM = document.getElementById('disponibiliteM');
const listeModifierI = document.getElementById('listeModifierI');
listeModifierI.addEventListener('click', () => {
    var idI = listeModifierI.options[listeModifierI.selectedIndex].value;

    var docRef = db.collection("installations").doc(idI);
    docRef.get().then((doc) => {
        if (doc.exists) 
        {
            var data = doc.data();
            var nameM = data.name;
            var numberM = data.number;
            var adresseM = data.adresse;
            var free = data.free;

            document.getElementById('nameM').value = nameM;
            document.getElementById('numberM').value = numberM;
            document.getElementById('adresseM').value = adresseM;

            if(free == "true"){
            disponibiliteM.value = "true";
            }else{
                disponibiliteM.value = "false";
            }
            
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});

//Update des informations
const modifierI = document.getElementById('modifierI');
modifierI.addEventListener('click', () => {

    var idInstaM = listeModifierI.options[listeModifierI.selectedIndex].value;

    var name = document.getElementById('nameM');
    var adresse = document.getElementById('adresseM');
    var number = document.getElementById('numberM');
    var free = disponibiliteM.options[disponibiliteM.selectedIndex].value;

    db.collection("installations").doc(idInstaM).update({
        name: name.value,
        adresse: adresse.value,
        number: number.value,
        free: free,
    })
    .then(() => {
        alert("Les informations de l'installation ont bien été modifiées !");

        name.value = "";
        adresse.value = "";
        number.value = "";
        
        location.reload();
    })
    .catch(function(error) {
        alert(error);
    });
});

//Remplissage liste des installations delete
const installationsD = db.collection('installations').get();
installationsD.then((snap) => {
    snap.docs.forEach((doc) => {

        var data = doc.data();
        var name = data.name;
        var id = data.id;

        document.getElementById("listeD").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Suppression d'une installation
const deleteI = document.getElementById('deleteI');
deleteI.addEventListener('click', () => {
    var idID = listeD.options[listeD.selectedIndex].value;

    //Suppresion de la base de donnée
    db.collection("installations").doc(idID).delete().then(() => {
        alert("L'installation à bien été supprimé");
        location.reload();
    }).catch((error) => {
        alert.error("Error removing document: ", error);
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

