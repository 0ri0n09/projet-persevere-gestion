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
            var role = data.role;
            nameUser = data.name;
            document.getElementById("username").innerHTML = nameUser;
            //console.log("nameUSER : "+nameUser);
            
            //Si user est un "user"
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

//Bouton Validation pour ajouter un utilisateur
const validateUser = document.getElementById('validateUser');
console.log(validateUser);
validateUser.addEventListener('click', () => {

    const email = document.getElementById('emailU').value;
    const name = document.getElementById('nameU').value;
    const phone_number = document.getElementById('phone_numberU').value;
    const date_inscription = document.getElementById('date_inscriptionU').value;
    const role = "user";
    const password = makePwd(10);

    //console.log(email, password);
    console.log(email);
    console.log(password);
    console.log(name);
    console.log(phone_number);
    console.log(date_inscription);
    console.log(role);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const userUID = userCredential.user.uid;
            //Fonction pour ajouter un utilisateur
            db.collection("users").add({
                email: email,
                id: userUID,
                name: name,
                role: role,
                phone_number: phone_number,
                date_inscription: date_inscription,
                password: password,
            })
            .then(() => {
                console.log("Document written with ID:", userUID);
                /*firebase.auth.sendPasswordResetEmail(email)
                .then(function() {  
                    console.log("EMAIL ENVOYE");
                })
                .catch(function(error) {
                    console.log("ERREUR EMAIL");
                });*/
            })
            .catch((error) => {
                console.error("Error adding document:", error);
            }); 
        })
        .catch((error) => {
            console.error("Cannot signup:", error.code, error.message);
            console.error("Email et/ou Mot de passe invalide", error.code, error.message);

            document.getElementById("error").innerHTML=`
            <strong style="color:#FF0000">
                Les informations ne sont pas valides
            </strong>`;
        });
    })
    .catch((error) => {
    console.error("Cannot signup:", error.code, error.message);
    });
   
//Bouton ajouter un Pro
const inscriptionBtnPro = document.getElementById('inscriptionBtnPro');
inscriptionBtnPro.addEventListener('click', () => {
    const email = document.getElementById('emailP');
    const name = document.getElementById('nameP');
    const phone_number = document.getElementById('phone_numberP');
    const date_inscription = document.getElementById('date_inscriptionP');
    const job = document.getElementById('jobP');
    const job_description = document.getElementById('job_descriptionP');
    const role = "pro";
    const password = makePwd(20);

    //console.log(email, password);
    console.log(name.value)
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            const userUID = userCredential.user.uid;
            addPro(userUID, email.value, password.value, name.value, phone_number.value, role.value, date_inscription.value, job.value, job_description.value);
        })
        .catch((error) => {
            console.error("Cannot signup:", error.code, error.message);
            console.error("Email et/ou Mot de passe invalide", error.code, error.message);

            document.getElementById("error").innerHTML=`
            <strong style="color:#FF0000">
                Les informations ne sont pas valides
            </strong>`;
        });
})
.catch((error) => {
    console.error("Cannot signup:", error.code, error.message);
});
        
//Fonction pour ajouter un professionnel
const addPro = (userUID, email, password, name, phone_number, role, date_inscription, job, job_description) => 
{
    console.log(name)
    db.collection("users").doc(userUID).set({
        email: email,
        id: userUID,
        name: name,
        role: role,
        phone_number: phone_number,
        date_inscription: date_inscription,
        password: password,
        job: job,
        job_description: job_description
    })
    .then(() => {
        console.log("Document written with ID:", userUID);

        firebase.auth.sendPasswordResetEmail(email)
        .then(function() {  
            console.log("EMAIL ENVOYE");
        })
        .catch(function(error) {
            console.log("ERREUR EMAIL");
        });
    })
    .catch((error) => {
        console.error("Error adding document:", error);
    });
}

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
