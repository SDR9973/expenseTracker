const url = `http://localhost:5001`;

window.onload = () => {
    addChild();
};

addChild = () => {
    document.getElementById(`addChildForm`).addEventListener(`submit`, (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get(`name`);
        const email = formData.get(`email`);
        const password = formData.get(`password`);
        const parent_id = document.cookie.split(`accountId=`)[1];
        fetch(`${url}/api/children/create`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password, name, parent_id
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.cookie = `childId=${data.childId}`;
                window.location.href = 'addNewWallet.html';
            })
            .catch(error => {
                console.error('Error adding child:', error);
            });
    });
};