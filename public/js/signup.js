
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
const loginBtn = document.getElementById('signup');

loginBtn.addEventListener('click', () => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                .then((userCredential) => {
                    const userUID = userCredential.user.uid;
                    addUser(userUID, email.value);
                })
                .catch((error) => {
                    console.error("Cannot signup:", error.code, error.message);
                });
        })
        .catch((error) => {
            console.error("Cannot signup:", error.code, error.message);
        });
})

const addUser = (userUID, email) => 
{
    db.collection("users").doc(userUID).set({
        email: email,
        id: userUID,
    })
    .then(() => {
        console.log("Document written with ID:", userUID);
        window.location.href = './accueil.html';
    })
    .catch((error) => {
        console.error("Error adding document:", error);
    });
}