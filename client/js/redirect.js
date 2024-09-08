window.onload = () => {
    checkUserLogin();
};

checkUserLogin = () => {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
    }, {});

    const userId = cookies['accountId'];
    if (!userId) {
        window.location.href = 'login.html';
    } else if (window.location.pathname === '/index.html') {
        if (cookies['accountType'] === 'parent') {
            window.location.href = 'parent.html';
        } else {
            window.location.href = 'child.html';
        }
    }
};