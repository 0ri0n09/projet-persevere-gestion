const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    console.log("logout");
    firebase.auth().signOut();
    window.location.href = './index.html';
});