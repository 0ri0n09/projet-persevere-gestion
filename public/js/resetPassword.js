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

const resetPassword = document.getElementById('resetPassword');
const email = document.getElementById('email');
resetPassword.addEventListener('click', () => {
    secondaryApp.auth().sendPasswordResetEmail(email.value)
    .then(() => {
        alert("L'email pour la réinitialisation de votre mot de passe à été envoyé !");
    })
    .catch(function(error) {
        alert("Email non correct");
    });
    secondaryApp.auth().signOut();
});



