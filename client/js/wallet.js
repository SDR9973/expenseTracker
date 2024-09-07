const url = `http://localhost:5001`;

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
    let childData = [];
    const parentId = cookies['accountId'];
    console.log(parentId);
    if (!parentId) {
        console.error('Parent ID not found in cookies');
        return;
    }
    try {
        const response = await fetch(`${url}/api/parents/${parentId}/children`);
        const data = await response.json();
        data.forEach(child => {
            childData.push(child);
        });
        return childData;
    }
    catch (error) {
        throw new Error('Error fetching children:', error);
    }
}

getAllowance = async () => {
    let walletData = [];
    const parentId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/wallets/all/${parentId}`);
        const data = await response.json();
        data.forEach(wallet => {
            walletData.push(wallet);
        });
        return walletData;
    }
    catch (error) {
        throw new Error('Error fetching wallets:', error);
    }
}

loadList = (childData, walletData) => {
    const childrenList = document.getElementsByClassName('childrenList')[0];
    childrenList.innerHTML = '';
    childData.forEach(child => {
        let wallet = walletData.find(wallet => wallet.child_id === child.child_id);
        if (!wallet) {
            wallet = { allowence: 0, currency: '$' };
        }
        if (wallet.allowance === undefined) {
            wallet.allowance = 0;
        }
        if (wallet.currency === undefined) {
            wallet.currency = '$';
        }

        const childElement = `
            <li class="list-group-item mb-3 childItem">
                <h3>${child.name}</h3>
                <form class="input-group">
                    <input type="number" step=".01" class="form-control" placeholder="${wallet.allowance}">
                    <span class="input-group-text">${wallet.currency}</span>
                    <button type="submit" class="btn btn-primary">Change</button>
                    <button type="reset" class="btn btn-outline-secondary trash" data-childId="${child.child_id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </form>
            </li>`;
        childrenList.innerHTML += childElement;
    });
};

eventListeners = () => {
    document.addEventListener('submit', handleChildUpdate);
    document.addEventListener('reset', handleChildDelete);
};

handleChildUpdate = async (event) => {
    const childId = event.target.getElementsByClassName('trash')[0].getAttribute('data-childId');
    const allowance = event.target.getElementsByClassName('form-control')[0].value;
    const currency = event.target.getElementsByClassName('input-group-text')[0].innerText;
    const parentId = cookies['accountId'];
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
        event.target.closest('.childItem').remove();
    }
    catch (error) {
        console.error('Error deleting child:', error);
    }
};