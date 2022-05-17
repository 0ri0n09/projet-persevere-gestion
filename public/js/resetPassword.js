
/*const email = document.getElementById('email');

const resetPassword = document.getElementById('resetPassword');
resetPassword.addEventListener('click', () => {
    auth().generatePasswordResetLink(email)
    .then(function() {  
            console.log("GOOO");
        })
    .catch(function(error) {
        console.log("ERREUR");
    });
});*/
            

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


const auth = getAuth();
sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });



