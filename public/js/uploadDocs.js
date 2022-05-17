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

//Remplissage liste des Users
const users = db.collection('users').get();
users.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var name = data.name;
        var id = data.id;
        //console.log(id);
        //console.log(name);
        document.getElementById("liste").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Upload d'un fichier
const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', () => {
    const ref = firebase.storage().ref();
    const file = document.querySelector('#file').files[0];
    const name = (+new Date()) + '-' + file.name;
    var select = document.getElementById('liste');
    var titleAdd = document.getElementById('title').value;
    var idUser = select.options[select.selectedIndex].value;
    const metadata = {
        contentType: file.type
    };

    if(idUser != "Sélectionnez un utilisateur"){
        if(titleAdd == null || titleAdd == "")
        {
            titleAdd = "Document sans titre";
        }
        const task = ref.child(name).put(file, metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            db.collection("documents").add({
                downloadURL: url,
                id_user: idUser,
                title: titleAdd,
            })
            .then(() => {
                alert("Le document à été télécharger !\n"+url);
            })
            .catch((error) => {
                alert("Error adding document:", error);
            });
        })
        .catch(console.error);
    }
    else{alert("Veuillez sélectionner un utilisateur, un fichier, et entrez un titre pour le document");}
});


//Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});


