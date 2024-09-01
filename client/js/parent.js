window.onload = () => {
    loadMonth();
    getChildren();
    eventListeners();
    getTransactions();
}

getChildren = () => {
    let parentId = document.cookie.split('=')[1];
    // fetch(`/api/children/:${parentId}`)
    fetch(`/dev/children.json`)
        .then(response => response.json())
        .then(data => {
            const childList = document.getElementById('childList');
            data.forEach(child => {
                const childElement = document.createElement('option');
                childElement.innerHTML = child.name;
                childElement.value = child.child_id;
                childList.appendChild(childElement);
            });
        })
        .then(() => {
            document.cookie = `childId=${document.getElementById('childList')[0].value}`;
        }).catch(() => {
            console.log('Error fetching children');
            // reload();
        });
}

loadMonth = () => {
    const selectElement = document.getElementById('monthSelect');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month_now = new Date().getMonth();
    for (let i = 0; i < 3; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = i;
        optionElement.innerHTML = months[(month_now + 1 - i) % 12];
        selectElement.appendChild(optionElement);
    }
    document.cookie = `month=${month_now + 1}`;
}

eventListeners = () => {
    document.getElementById('childList').addEventListener('change', (event) => {
        const child_id = event.target.value;
        document.cookie = `childId=${child_id}`;
        getTransactions();
    });
    document.getElementById('monthSelect').addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        document.cookie = `month=${selectedValue}`;
        getTransactions();
    });
}

getTransactions = () => {
    const month = document.cookie.split('month=')[1].split(';')[0];
    const childId = document.cookie.split('childId=')[1];
    console.log(`Fetching transactions for childId: ${childId} and month: ${month}`);
    // fetch(`/api/transactions/child/${childId}/month/${month}`)
    fetch(`/dev/transaction.json`)
        .then(response => response.json())
        .then(data => {
            const transactionList = document.getElementById('transactionList');
            transactionList.innerHTML = '';
            data.forEach(transaction => {
                const transactionElement = document.createElement('li');
                transactionElement.innerHTML =
                    `<div class="shopping"></div>
                    <div>
                        <h4>Shopping</h4>
                        <p>${transaction.transfer_amount}</p>
                        <p>${transaction.description}</p>
                        <p>${transaction.date}</p>
                    </div>`;
                transactionList.appendChild(transactionElement);
            });
        }).then(() => {
            console.log(`Transactions fetched for childId: ${childId} and month: ${month}`);
        }).catch(() => {
            console.log('Error fetching transactions');
            // reload();
        });
}