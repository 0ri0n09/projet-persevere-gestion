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

//Nombre total d'utilisateurs
let cptU = 0;
const users = db.collection('users').get();
users.then((snap) => {
    snap.docs.forEach((doc) => {
        cptU++;
    })

    document.getElementById("nbrUsers").innerHTML += `
    <!--Retour-->
    <div class="md:w-1/2 xl:w-1/3 p-1">
        
        <div class="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700 transition duration-300">
            Nombre total d'utilisateurs inscrits : <span class="font-bold">${cptU}</span>
        </div>
        
    </div>
    `;
});

//Nombre total de pensionnaires
let cptP = 0;
const boarders = db.collection('boarders').get();
boarders.then((snap) => {
    snap.docs.forEach((doc) => {
        cptP++;
    })

    document.getElementById("nbrBoarders").innerHTML += `
    <!--Retour-->
    <div class="md:w-1/2 xl:w-1/3 p-1">
        
        <div class="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-600 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600 transition duration-300">
            Nombre total de pensionnaires inscrits : <span class="font-bold">${cptP}</span>
        </div>
        
    </div>
    `;
});

//Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});