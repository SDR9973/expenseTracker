const url = `http://localhost:5001`;

window.onload = async () => {
    try {
        pageCheck();
        const childData = await getChildren();
        const walletData = await getAllowance();
        loadList(childData, walletData);
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
            <li class="list-group-item mb-3 childItem" data-childId="${child.child_id}">
                <h3>${child.name}</h3>
                <div class="input-group">
                    <input type="number" class="form-control" placeholder="${wallet.allowance}">
                    <span class="input-group-text">${wallet.currency}</span>
                    <button class="btn btn-primary">Change</button>
                    <button class="btn btn-outline-secondary">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div >
            </li>`;
        childrenList.innerHTML += childElement;
    });
}