const url = 'https://expensetracker-qi9u.onrender.com';

window.onload = () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        loginError.style.display = 'none';
        let email = document.getElementById('emailInput').value;
        let password = document.getElementById('passwordInput').value;
        let account_type = document.getElementById('accountTypeInput').value;
        fetch(`${url}/api/login/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, account_type })
        })
            .then(response => response.json())
            .then(data => {
                if (account_type === 'parent') {
                    document.cookie = `accountId=${data.login.parent_id}`;
                    window.location.href = 'parent.html';
                } else {
                    document.cookie = `accountId=${data.login.child_id}`;
                    window.location.href = 'child.html';
                }
            }).catch(() => {
                loginError.style.display = 'block';
            });
    });
};
