const url = `https://expensetracker-qi9u.onrender.com`;

window.onload = () => {
    loadMonth();
    eventListeners();
    getTransactions();
    popOverEnable();
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
    const selectElement = document.getElementById('monthSelect');
    selectElement.addEventListener('change', () => {
        document.cookie = `month=${selectElement.value}`;
        getTransactions();
    });
}

getTransactions = () => {
    const month = document.cookie.split('month=')[1].split(';')[0];
    const childId = document.cookie.split('accountId=')[1];
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
    let categories = [];
    fetch(`../data/categories.json`)
        .then(response => response.json())
        .then(data => {
            categories = data.categories;
        });
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
                let icon = '';
                icon = categories.find(category => category.title === transaction.category);
                if (icon === undefined)
                    icon = '<i class=\"bi bi-question-circle-fill\"></i>';
                else
                    icon = icon.icon;
                const transactionElement = document.createElement('li');
                transactionElement.innerHTML =
                    `<div class="transactionIcon">
                        ${icon}
                    </div>
                    <div>
                        <h4>${transaction.category}</h4>
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
            balanceElement.innerHTML = `$${balance}/${allowance}`;
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

popOverEnable = () => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    // const popover = new bootstrap.Popover('.popover-dismiss', {
    //     trigger: 'focus'
    //   })
}