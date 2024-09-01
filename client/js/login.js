const url = 'http://localhost:5001';

window.onload = () => {
    let loginForm = document.getElementById('loginForm');
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let email = document.getElementById('emailInput').value;
        let password = document.getElementById('passwordInput').value;
        fetch(`${url}/api/parents/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                document.cookie = `parentId=${data.parent.parent_id}`;
                window.location.href = 'parent.html';
            }).catch(() => {
                document.getElementById(`loginError`).style.display = 'block';
            });
    });
};
