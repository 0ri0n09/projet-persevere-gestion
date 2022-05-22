const db = firebase.firestore();

//Affichage User courant + setName Accueil Header
var nameUser;
var idUserCurrent;
firebase.auth().onAuthStateChanged((user) => 
{
    if (user) {
      idUserCurrent = user.uid;
      //console.log(idUserCurrent);
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

//Remplissage liste des documents du idUserCurrent
const listeDel = document.getElementById("listeDel")
const documents = db.collection('documents').get();
documents.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var title = data.title;
        var idDoc = data.id_user;

        //console.log("idDOC :" + idDoc);
        //console.log("idUSER :" + idUser);
        
        if(idDoc == idUserCurrent){
            listeDel.innerHTML += `
                <option value="${idDoc}">${title}</option>
            `;
        }
    })
});

//Affichage des document du user courant
const mesDocs = document.getElementById('mesDocs');
documents.then((snap) => {
    snap.docs.forEach((doc) => {
        //console.log(doc);
        var data = doc.data();
        var title = data.title;
        var idDoc = data.id_user;
        var url = data.downloadURL;
        var color = "";
        
        if(idDoc == idUserCurrent){

        //Nombre random entre de 0 à 5
        var nbrAlea = Math.floor(Math.random() * 6);

        switch(nbrAlea){
            case 0: color = "blue";
            break;

            case 1: color = "green";
            break;

            case 2: color = "purple";
            break;

            case 3: color = "orange";
            break;

            case 4: color = "yellow";
            break;

            case 5: color = "red";
            break;
        }
            mesDocs.innerHTML += `
            <button class="w-full md:w-1/2 xl:w-1/3 p-6 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out">
                <a href="${url}">
                    <div class="bg-gradient-to-b from-${color}-200 to-${color}-100 border-b-4 border-${color}-600 rounded-lg shadow-xl p-5">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pr-4">
                                <div class="rounded-full p-5 bg-${color}-600"><i class="fa fa-file fa-2x fa-inverse"></i></div>
                            </div>
                            <div class="flex-1 text-right md:text-center">
                                <p class="font-bold text-xl">${title}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </button>
            `;
        }
    })
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


