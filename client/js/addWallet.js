const url = `https://expensetracker-qi9u.onrender.com`;
window.onload = () => {
    getChildren();
    loadCurrencies();

    const continueButton = document.querySelector('.button');
    continueButton.addEventListener('click', handleSubmit);
}

getChildren = () => {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
    }, {});

    const parentId = cookies['accountId'];
    console.log(parentId);
    if (!parentId) {
        console.error('Parent ID not found in cookies');
        return;
    }

    fetch(`${url}/api/parents/${parentId}/children`)
        .then(response => response.json())
        .then(data => {
            const childList = document.getElementById('childList');
            childList.innerHTML = '';
            data.forEach(child => {
                console.log(child);
                const childElement = document.createElement('option');
                childElement.innerHTML = child.name;
                childElement.value = child.child_id;
                childList.appendChild(childElement);
            });


            if (data.length > 0) {
                document.cookie = `childId=${childList.options[0].value}`;
            }
        })
        .catch(error => {
            console.error('Error fetching children:', error);
        });
}

loadCurrencies = () => {
    fetch('./data/currencies.json')
        .then(response => response.json())
        .then(currencies => {
            console.log(currencies)
            const currencySelect = document.getElementById('currencySelect');
            currencies.forEach(currency => {
                console.log(currencySelect)
                const option = document.createElement('option');
                option.value = currency.symbol;
                option.text = `${currency.symbol}`;
                currencySelect.appendChild(option);
            });

            currencySelect.value = '$';
        })
        .catch(error => console.error('Error loading currencies:', error));
}

handleSubmit = () => {
    const childList = document.getElementById('childList');
    const currencySelect = document.getElementById('currencySelect');
    const bankSelect = document.getElementById('bankSelect');
    const balanceInput = document.getElementById('balanceInput');

    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
    }, {});

    const parentId = parseInt(cookies['accountId']);
    const childId = parseInt(childList.value);
    const allowance = parseFloat(balanceInput.value);
    const bank = bankSelect.value;
    const currency = currencySelect.value;

    const walletData = {
        "child_id": childId,
        "parent_id": parentId,
        "allowance": allowance,
        "bank": bank,
        "currency": currency
    };
    console.log("wallet data :")
    console.log(walletData);

    fetch(`${url}/api/wallets/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(walletData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'wallet.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
