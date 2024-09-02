const url = `http://localhost:5001`;

window.onload = () => {
    loadMonth();
    getChildren();
    eventListeners();
    getTransactions();
}

getChildren = () => {
    // Retrieve the parentId from the cookies
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
    }, {});

    const parentId = cookies['parentId'];
    console.log(parentId)
    if (!parentId) {
        console.error('Parent ID not found in cookies');
        return;
    }

    // Fetch the children of the parent
    fetch(`${url}/api/parents/${parentId}/children`)
        .then(response => response.json())
        .then(data => {
            const childList = document.getElementById('childList');
            childList.innerHTML = ''; // Clear any existing options
            data.forEach(child => {
                console.log(child)
                const childElement = document.createElement('option');
                childElement.innerHTML = child.name;
                childElement.value = child.child_id;
                childList.appendChild(childElement);
            });

            // Set the first child's ID as a cookie if there are children
            if (data.length > 0) {
                document.cookie = `childId=${childList.options[0].value}`;
            }
        })
        .catch(error => {
            console.error('Error fetching children:', error);
        });
}


loadMonth = () => {
    const selectElement = document.getElementById('monthSelect');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month_now = new Date().getMonth() + 1;
    selectElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = (month_now - i) % 12;
        optionElement.innerHTML = months[(month_now - i) % 12];
        selectElement.appendChild(optionElement);
    }
    document.cookie = `month=${month_now}`;
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
    let income = 0;
    let expense = 0;
    let balance = 0;
    let allowance = 0;
    const incomeElement = document.getElementById('income');
    const expenseElement = document.getElementById('expense');
    const balanceElement = document.getElementsByClassName('balance_amount')[0];
    const transactionList = document.getElementById('transactionList');
    incomeElement.innerHTML = `$...`;
    expenseElement.innerHTML = `$...`;
    balanceElement.innerHTML = `$.../$...`;
    transactionList.innerHTML = `
        <li>
            <p>Loading ...</p>
        </li>`;
    fetch(`${url}/api/wallets/${childId}`)
        .then(response => response.json())
        .then(data => {
            allowance = data.allowance;
            balance = Number(data.allowance);
            return fetch(`${url}/api/transactions/child/${childId}/month/${month}`)
        })
        .then(response => response.json())
        .then(data => {
            transactionList.innerHTML = '';
            data.forEach(transaction => {
                transfer_amount = Number(transaction.transfer_amount);
                if (transfer_amount < 0)
                    expense += transfer_amount;
                else
                    income += transfer_amount;
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
            balance += income + expense;
            incomeElement.innerHTML = `$${income}`;
            expenseElement.innerHTML = `$${expense}`;
            balanceElement.innerHTML = `$${balance} / $${allowance}`;
            console.log(`Transactions fetched for childId: ${childId} and month: ${month}`);
        }).catch(() => {
            transactionList.innerHTML =
                `<li>
                    <div class="transaction_icon"></div>
                    <div>
                        <h4>Nothing yet</h4>
                        <p>There are no transactions for this month</p>
                    </div>
                </li>`;
            incomeElement.innerHTML = `$0.00`;
            expenseElement.innerHTML = `$0.00`;
            balanceElement.innerHTML = `$${allowance} / $${allowance}`;
        });
}