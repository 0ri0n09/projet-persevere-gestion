const db = firebase.firestore();

//Affichage User courant + setName Accueil Header
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
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
      });
});

//Remplissage liste des Users bouton Upload
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
                alert("Le document à été téléchargé !\n\n"+url);
                location.reload();
            })
            .catch((error) => {
                alert("Error adding document:", error);
            });
        })
        .catch(console.error);
    }
    else{alert("Veuillez sélectionner un utilisateur, un fichier, et entrez un titre pour le document");}
});

//Remplissage liste des documents
const liste = document.getElementById('liste');
const listeDel = document.getElementById("listeDel")
var noDoc = false;
liste.addEventListener('change', () => {
    removeOptions(listeDel);
    const documents = db.collection('documents').get();
    documents.then((snap) => {
        snap.docs.forEach((doc) => {
            //console.log(doc);
            var data = doc.data();
            var title = data.title;
            var idDoc = data.id_user;

            var select = document.getElementById('liste');
            var idUser = select.options[select.selectedIndex].value;
            //console.log("idDOC :" + idDoc);
            //console.log("idUSER :" + idUser);
            
            if(idUser == idDoc){
                noDoc = false
                listeDel.innerHTML += `
                    <option value="${idDoc}">${title}</option>
                `;
            }else{noDoc = true;}
        })
    });
});

//Fonction remove 
function removeOptions(selectElement) {
        if(noDoc){
            listeDel.innerHTML += `
                <option value="none">Aucun document disponible pour cet utilisateur</option>
            `;
        }
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }

//Supression d'un fichier
const dltBtn = document.getElementById('dltBtn');
dltBtn.addEventListener('click', () => {
    var docIdSelected = listeDel.options[listeDel.selectedIndex].value;
    var docTitleSelected = listeDel.options[listeDel.selectedIndex].text;
    //console.log("DOC ID_SELECTED :" + docIdSelected);
    //console.log("DOC TITLE_SELECTED :" + docTitleSelected);

    const documents = db.collection('documents').get();
    documents.then((snap) => {
        snap.docs.forEach((doc) => {
            //console.log(doc);
            var data = doc.data();
            var title = data.title;
            var id_user = data.id_user;
            var id = doc.id;
            //console.log("id_USER " + id_user);
            //console.log("ID : " + id);
    
            if(title == docTitleSelected && id_user == docIdSelected)
            {
                db.collection("documents").doc(id).delete().then(() => {
                    alert("Le document à bien été supprimé");
                    location.reload();
                }).catch((error) => {
                    alert.error("Error removing document: ", error);
                });
            }
        });
    });
});

//Déconnexion 
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});


