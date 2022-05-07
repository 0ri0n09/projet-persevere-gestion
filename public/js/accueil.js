const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    console.log("BJR");
    firebase.auth().signOut();
    window.location.href = './index.html';
});