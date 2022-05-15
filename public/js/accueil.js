const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    firebase.auth().signOut();
    window.location.href = './index.html';
});