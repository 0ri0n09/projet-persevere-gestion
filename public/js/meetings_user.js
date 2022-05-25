const db = firebase.firestore();

//Affichage User courant + setName Accueil Header
var nameUser;
var idUser;
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
            idUser = user.uid;
            document.getElementById("username").innerHTML = nameUser;
            
            //Si user est un "admin"
            if(role == "admin"){
                window.location.href = './accueil_admin.html';
            }

            //Si user est un "pro"
            if(role == "pro"){
                window.location.href = './accueil_pro.html';
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).then((user) => {
            idUser = user.uid;
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });


    //Remplissage listeBoarders selon l'utilisateur courant
    const boarders = db.collection('boarders').get();
    boarders.then((snap) => {
        snap.docs.forEach((doc) => {
            var data = doc.data();
            var name = data.name;
            var id = data.id;
            var id_user = data.id_user;
            
            if(idUser == id_user){
                document.getElementById("listeBoarders").innerHTML += `
                    <option value="${id}">${name}</option>
                `;
            }
        })
    });
});


//Affichage des activités selon le pensionnaire sélectionné
const listeBoarders = document.getElementById('listeBoarders');
listeBoarders.addEventListener('click', () => {

    //Clear des events
    var listEvent = calendar.getEvents();
    listEvent.forEach(event => { 
      event.remove()
    });

    //Clear des events
    for (var i=0; i < eventsDlt.length; i++) {
        eventsDlt.remove(i);
        eventsDlt.remove(0);
    }
    eventsDlt.selectedIndex = 0;

    var idBoarder = listeBoarders.options[listeBoarders.selectedIndex].value;

    //Remplissage du calendar
    const events = db.collection('events').get();
    events.then((snap) => {
        snap.docs.forEach((doc) => {
            var data = doc.data();
            var title = data.title;
            var id_boarder = data.id_boarder;
            var date_heure_debut = data.date_heure_debut;
            var date_heure_fin = data.date_heure_fin;
            var id_installation = data.id_installation;

            var docRef = db.collection("installations").doc(id_installation);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    var nameI = data.name;
                    title = title.concat(" | Installation: " + nameI);

                    if(id_boarder == idBoarder){

                        calendar.addEvent({
                        title: title,
                        start: date_heure_debut,
                        end : date_heure_fin
                        });
                    }

                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        })
    })
})

//Calendar
var calendar;
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

      calendar = new FullCalendar.Calendar(calendarEl, {
      timeZone: 'UTC',
      locale: 'fr',

      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },

      
      initialDate: Date.now(),
      navLinks: true, // can click day/week names to navigate views
      editable: false,
      dayMaxEvents: true, // allow "more" link when too many events

      events: [
        {
          title: "Meeting "+"| test",
          start: '2022-05-29T10:30:00',
          end: '2022-05-29T12:30:00'
        },
      ],
    });
    
    calendar.setOption('aspectRatio', 1.8);
    calendar.setOption('locale', 'fr');
    //calendar.updateSize();
    calendar.render();
});

//Remplissage de proAdd
const pros = db.collection('users').get();
pros.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var name = data.name;
        var id = data.id;
        var role = data.role;

        if(role == "pro"){
            document.getElementById("proAdd").innerHTML += `
                <option value="${id}">${name}</option>
            `;
        }
    })
});

//Affichage du job du pro sélectionné
const proAdd = document.getElementById('proAdd');
proAdd.addEventListener('change', () => {
    var idPro = proAdd.options[proAdd.selectedIndex].value;

    //Récupération du job du pro
    var docRef = db.collection("users").doc(idPro);
    docRef.get().then((doc) => {
        if (doc.exists) {
            var data = doc.data();
            jobPro = data.job;
            namePro = data.name;

            document.getElementById("job_pro").innerHTML += `
                    <span class"font-weight: bold">${jobPro}</span>
            `;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

});

//Remplissage de installationsAdd
const installations = db.collection('installations').get();
installations.then((snap) => {
    snap.docs.forEach((doc) => {
        var data = doc.data();
        var id = data.id;
        var name = data.name;

        document.getElementById("installationsAdd").innerHTML += `
            <option value="${id}">${name}</option>
        `;
    })
});

//Ajout d'une activité
const btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener('click', () => {

    //Récupération des inputs
    var idBoarder = listeBoarders.options[listeBoarders.selectedIndex].value; 
    var id = makePwd(20);
    var idPro = proAdd.options[proAdd.selectedIndex].value; 
    var idInstallation = installationsAdd.options[installationsAdd.selectedIndex].value;
    let nomPro = "le chat";

    //Récupération du nom du pro
    var docRef = db.collection("users").doc(idPro);
    docRef.get().then((doc) => {
        console.log(nomPro);
        if (doc.exists) {
            console.log("exists");
            var data = doc.data();
            nomPro = data.name;
            // console.log(nomPro);
        } else {
            console.log("no exists");
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        console.log(nomPro);
    }).catch((error) => {
        console.log("Error getting document:", error);
    }).then(() => {

        const dateAddDebut = document.getElementById('dateAddDebut').value;
        const dateAddFin = document.getElementById('dateAddFin').value;
        const heuresAddDebut = document.getElementById('heuresAddDebut').value;
        const minutesAddDebut = document.getElementById('minutesAddDebut').value;
        const heuresAddFin = document.getElementById('heuresAddFin').value;
        const minutesAddFin = document.getElementById('minutesAddFin').value;
        const nomAdd = document.getElementById('nomAdd').value;
        const descriptionAdd = document.getElementById('descriptionAdd').value;
        const prixAdd = document.getElementById('prixAdd').value;
    
        //Conversion dates
        var date_debut = convertDate(dateAddDebut);
        var date_fin = convertDate(dateAddFin);
    
        //Conversion heures BDD
        var heure_debut = convertHeure(heuresAddDebut, minutesAddDebut);
        var heure_fin = convertHeure(heuresAddFin, minutesAddFin);
        
        //Conversion dates et heures début Calendar
        var date_heure_debut = date_debut;
        date_heure_debut = date_heure_debut.concat("T");
        date_heure_debut = date_heure_debut.concat(heure_debut);
    
        //Conversion dates et heures fin Calendar
        var date_heure_fin = date_fin;
        date_heure_fin = date_heure_fin.concat("T");
        date_heure_fin = date_heure_fin.concat(heure_fin);
    
        //Titre + description + pro + prix
        var title = nomAdd;
        title = title.concat(" | " + descriptionAdd);
        title = title.concat(" | Professionnel: " + nomPro)
        title = title.concat(" | Prix: " + prixAdd + " €");
    
        //Ajout de l'activité à la base de données
        db.collection("events").doc(id).set({
            id: id,
            date_debut: date_debut,
            date_fin: date_fin,
            date_heure_debut: date_heure_debut,
            date_heure_fin: date_heure_fin,
            description: descriptionAdd,
            heure_debut: heure_debut,
            heure_fin: heure_fin,
            id_boarder: idBoarder,
            id_installation: idInstallation,
            id_user: idPro,
            prix: prixAdd,
            title: title,
            
        })
        .then(() => {
            
            alert("L'activité "+ nomAdd +"' a été ajoutée !");
            location.reload();
        })
        .catch((error) => {
            alert(error);
        });
    
    });
});

//Remplissage de la liste eventsDlt
const eventsDlt = document.getElementById('eventsDlt');
eventsDlt.addEventListener('click', () => {
    var idBoarder = listeBoarders.options[listeBoarders.selectedIndex].value;

    //Clear des events
    for (var i=0; i < eventsDlt.length; i++) {
        eventsDlt.remove(i);
        eventsDlt.remove(0);
    }
    eventsDlt.selectedIndex = 0;
    
    const events = db.collection('events').get();
    events.then((snap) => {
        snap.docs.forEach((doc) => {
            var data = doc.data();
            var idEvent = data.id;
            var id_boarder = data.id_boarder;
            var title = data.title;

            if(idBoarder == id_boarder){
                document.getElementById("eventsDlt").innerHTML += `
                <option value="${idEvent}">${title}</option>
                `;
            }      
        })
    });
});

//Suppression de l'activité
const btnDlt = document.getElementById('btnDlt');
btnDlt.addEventListener('click', () => {
    var idEvent = eventsDlt.options[eventsDlt.selectedIndex].value;

    //Suppresion de la base de donnée
    db.collection("events").doc(idEvent).delete().then(() => {
        alert("L'activité à bien été supprimée");
        location.reload();
    }).catch((error) => {
        alert.error("Error removing document: ", error);
    });
});

//Conversion Dates    
function convertDate(date) {

    const selectDate = date;
    const [day, month, year] = selectDate.split('/');
    const dateF = [year, month, day].join('-');
    return dateF;
}

//Conversion Heures
function convertHeure(heure, minute) {

    let heure_full = heure;
    heure_full = heure_full.concat(":");
    heure_full = heure_full.concat(minute);
    heure_full = heure_full.concat(":00");
    
    return heure_full;
}

//Générer un mot de passe aléatoire
function makePwd(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});
