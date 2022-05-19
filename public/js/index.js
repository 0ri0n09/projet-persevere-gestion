const firebaseConfig = {
    apiKey: "AIzaSyDHt321Q9fjJEkTdTt8D7FKLArPLTkrrys",
    authDomain: "persevere-9b1cd.firebaseapp.com",
    databaseURL: "",
    projectId: "persevere-9b1cd",
    storageBucket: "persevere-9b1cd.appspot.com",
    messagingSenderId: "1094027429774",
    appId: "1:1094027429774:web:a44c5364dc15611afd06df",
    measurementId: "G-KERQPT5Q7X"
  };

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

const email = document.getElementById('email');
const password = document.getElementById('password');

const loginBtn = document.getElementById('login');
loginBtn.addEventListener('click', () => {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                
                firebase.auth().signInWithEmailAndPassword(email.value, password.value)
                    .then((userCredential) => {
                        const userUID = userCredential.user.uid;
                        window.location.href = './accueil.html';
                    })
                    .catch((error) => {
                        console.error("Cannot signup:", error.code, error.message);
                        console.error("Email et/ou Mot de passe invalide", error.code, error.message);

                        document.getElementById("error").innerHTML=`
                        <strong style="color:#FF0000">
                            Email et/ou mot de passe non valide(s) !
                        </strong>`;
                    });
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            });

})