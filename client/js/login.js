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
            if (response.status === 200) {
                document.cookie = `parentId=${response.parent_id}`;
                document.cookie = `childId=${response.child1_id}`;
                window.location.href = '/parent';
            } else {
                // Display an error message
                // as a line of text on the page in red
                // below the login form
                // !!!
                alert('Invalid username or password');
            }
        });
    };
}
