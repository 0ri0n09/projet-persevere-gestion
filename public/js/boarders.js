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

    //Remplissage de la liste boarders
    const boarders = db.collection('boarders').get();
    boarders.then((snap) => {
        snap.docs.forEach((doc) => {
            //console.log(doc);
            var data = doc.data();
            var name = data.name;
            var id_user = data.id_user;
            var id = data.id;

            if(user.uid == id_user){
                document.getElementById("listeBoarders").innerHTML += `
                    <option value="${id}">${name}</option>
                `;
            }
        })
    });

    //Remplissage informations Boarder sélectionné
    listeBoarders.addEventListener('change', () => {
        idSelect = listeBoarders.options[listeBoarders.selectedIndex].value;
    
        var docRef = db.collection("boarders").doc(idSelect);
        docRef.get().then((doc) => {
            if (doc.exists) 
            {
                var data = doc.data();
                var birthdate = data.birthdate;
                var board_price = data.board_price;
                var entry_date = data.entry_date;
                var gender = data.gender;
                var name = data.name;
                var options = data.options;
                var race = data.race;
                var weight = data.weight;
    
                document.getElementById('birthdate').value = birthdate;
                document.getElementById('board_price').value = board_price;
                document.getElementById('entry_date').value = entry_date;
                document.getElementById('gender').value = gender;
                document.getElementById('name').value = name;
                document.getElementById('options').value = options;
                document.getElementById('race').value = race;
                document.getElementById('weight').value = weight;
                
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    });

});

//Déconnexion
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});

