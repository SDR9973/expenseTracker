const url = `https://expensetracker-qi9u.onrender.com`;

window.onload = async () => {
    try {
        pageCheck();
        const childData = await getChildren();
        const walletData = await getAllowance();
        loadList(childData, walletData);
        eventListeners();
    }
    catch (error) {
        console.error(error);
    }
};

const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = value;
    return acc;
}, {});

pageCheck = () => {
    const parentId = cookies['accountId'];
    console.log(parentId);
    if (!parentId) {
        console.error('Parent ID not found in cookies');
        throw new Error('Parent ID not found in cookies');
    }
}

getChildren = async () => {
    const parentId = cookies['accountId'];
    console.log(parentId);
    if (!parentId) {
        console.error('Parent ID not found in cookies');
        return;
    }
    try {
        const response = await fetch(`${url}/api/parents/${parentId}/children`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching children:', error);
    }
}

getAllowance = async () => {
    const parentId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/wallets/all/${parentId}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching wallets:', error);
    }
}

loadList = (childData, walletData) => {
    const childrenList = document.getElementsByClassName('childrenList')[0];
    childrenList.innerHTML = '';
    childData.forEach(child => {
        let formElement = '';
        let wallet = walletData.find(wallet => wallet.child_id === child.child_id);
        if (!wallet) {
            formElement = `<button class="btn btn-primary addWallet" data-childId="${child.child_id}">Add Wallet</button>`
        } else {
            if (wallet.allowance === undefined) {
                wallet.allowance = 0;
            }
            if (wallet.currency === undefined) {
                wallet.currency = '$';
            }
            formElement = `
                <form class="input-group">
                    <input type="number" step=".01" class="form-control" placeholder="${wallet.allowance}">
                    <span class="input-group-text">${wallet.currency}</span>
                    <button type="submit" class="btn btn-primary">Change</button>
                    <button type="reset" class="btn btn-outline-secondary trash" data-childId="${child.child_id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </form>`;
        }
        const childElement = `
            <li li class="list-group-item mb-3 childItem" >
                <h3>${child.name}</h3>
                ${formElement}
            </li> `;
        childrenList.innerHTML += childElement;
    });
};

eventListeners = () => {
    document.addEventListener('submit', handleChildUpdate);
    document.addEventListener('reset', handleChildDelete);
    document.addEventListener('click', handleAddWallet);
};

handleChildUpdate = async (event) => {
    const childId = event.target.getElementsByClassName('trash')[0].getAttribute('data-childId');
    const allowance = event.target.getElementsByClassName('form-control')[0].value;
    try {
        const response = await fetch(`${url}/api/wallets/${childId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                allowance: allowance
            })
        });
        const data = await response.json();
    }
    catch (error) {
        console.error('Error updating wallet:', error);
    }
};

handleChildDelete = async (event) => {
    const childId = event.target.getElementsByClassName('trash')[0].getAttribute('data-childId');
    try {
        const response = await fetch(`${url}/api/wallets/${childId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
    }
    catch (error) {
        console.error('Error deleting child:', error);
    }
};

handleAddWallet = async (event) => {
    const childId = event.target.getAttribute('data-childId');
    if (!childId) return;
    cookies['childId'] = childId;
    window.location.href = 'addNewWallet.html';
};