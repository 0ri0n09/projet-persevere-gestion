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

            //Si user est un "pro"
            if(role == "user"){
                window.location.href = './accueil.html';
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).then((user) => {
            
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });


    //Remplissage listeBoarders selon l'utilisateur courant
    const events = db.collection('events').get();
    var id_boarder;
    var id_user;
    events.then((snap) => {
            snap.docs.forEach((doc) => {
                var data = doc.data();
                id_user = data.id_user;
                id_boarder = data.id_boarder;
            })
            const boarders = db.collection('boarders').get();
            boarders.then((snap) => {
                snap.docs.forEach((doc) => {
                    var data = doc.data();
                    var name = data.name;
                    var id = data.id;
                    
                    if(user.uid == id_user){
                        document.getElementById("listeBoarders").innerHTML += `
                            <option value="${id_boarder}">${name}</option>
                        `;
                    }
                })
            });

        //Remplissage demandes Liste
        const eventsDemandes = db.collection('events').get();
        eventsDemandes.then((snap) => {
        snap.docs.forEach((doc) => {
        var data = doc.data();
        var title = data.title;
        var date_debut = data.date_debut;
        var heure_debut = data.heure_debut;
        var approved = data.approved;
        var id_user = data.id_user;
        var id = data.id;

        if(approved == "false" && id_user == user.uid)
        {
            document.getElementById("demandesListe").innerHTML += `
                                <tr>
                                    <td>${title}</td>
                                    <td>${date_debut}</td>
                                    <td>${heure_debut}</td>
                                    
                                    <br>
                                    <div class="flex fel-wrap justify-center">
                                        <button id="btnAccepter" class="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ease-in-out">
                                            Accepter
                                        </button>
                                    </div>
                                    <br>
                                    <div class="flex fel-wrap justify-center">
                                        <button id="btnRefuser" class="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded ease-in-out">
                                            Refuser
                                        </button>
                                    </div>
                                    
                                </tr>
            `;

            //Accepter la demande de RDV
            const btnAccepter = document.getElementById('btnAccepter');
            btnAccepter.addEventListener('click', () => {
                
                db.collection("events").doc(id).update({
                    approved: "true",
                })
                .then(() => {
                    alert("Le rendez-vous a été accepté !");
                    location.reload();
                })
                .catch(function(error) {
                    alert(error);
                });
    
            });

            //Refus et suppression du rendez-vous
            const btnRefuser = document.getElementById('btnRefuser');
            btnRefuser.addEventListener('click', () => {
                db.collection("events").doc(id).delete().then(() => {
                    alert("Le rendez-vous à bien été refusé");
                    location.reload();
                    }).catch((error) => {
                        alert.error("Error removing document: ", error);
                    });
                });
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
            var approved = data.approved;
            id_user = data.id_user;

            var docRef = db.collection("installations").doc(id_installation);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    var nameI = data.name;
                    title = title.concat(" | Installation: " + nameI);

                    firebase.auth().onAuthStateChanged((user) => 
                    {
                        if (user) {
                        //console.log(user)
                        }

                        if(id_boarder == idBoarder && approved == "true" && id_user == user.uid){

                            calendar.addEvent({
                            title: title,
                            start: date_heure_debut,
                            end : date_heure_fin
                            });
                        }
                    });
                    
                    if(title == "a"){
                        console.log("TESTA");
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
});

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
            approved: "true",
        })
        .then(() => {
            
            alert("La demande d'activité '"+ nomAdd +"' a été envoyée !");
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


