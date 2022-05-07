
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

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.location.href = './accueil.html';
    }
});

const loginBtn = document.getElementById('login');
loginBtn.addEventListener('click', () => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            firebase.auth().signInWithEmailAndPassword(email.value, password.value)
                .then(() => {
                    window.location.href = './accueil.html';
                })
                .catch((error) => {
                    console.error("Cannot login:", error.code, error.message);
                });
        })
        .catch((error) => {
            console.error("Cannot login:", error.code, error.message);
        });
})