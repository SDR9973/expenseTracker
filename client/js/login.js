document.onload = function() {
    let loginForm = document.getElementById('login-form');
    loginForm.onsubmit = function(event) {
        event.preventDefault();
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let data = {
            username: username,
            password: password
        };
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            // !!! add parent or child check here
            if (response.status === 200) {
                window.location.href = '/???';
            } else {
                alert('Invalid username or password');
            }
        });
    };
}
