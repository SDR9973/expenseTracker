const url = 'https://expensetracker-qi9u.onrender.com';

window.onload = async () => {
    try {
        pageCheck();
        popOverEnable();
        const allowance = await getAllowance();
        const transactions = await getTransactions();
        const child = await getChild();
        const catagories = await getCategories();
        const childArrayData = loadList(allowance, transactions, child, catagories);
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => drawChart(childArrayData, catagories));
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
    const childId = cookies['accountId'];
    if (!childId) {
        throw new Error('Child ID not found in cookies');
    }
};

getAllowance = async () => {
    const childId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/wallets/${childId}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching allowance:', error);
    }
};

getTransactions = async () => {
    const childId = cookies['accountId'];
    const month = cookies['month'];
    try {
        const response = await fetch(`${url}/api/transactions/child/${childId}/month/${month}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching transactions:', error);
    }
};

getChild = async () => {
    const childId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/children/${childId}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching children:', error);
    }
};

getCategories = async () => {
    try {
        const response = await fetch('../data/categories.json');
        const data = await response.json();
        return data.categories.map(category => category.title);
    }
    catch (error) {
        throw new Error('Error fetching categories:', error);
    }
};

loadList = (allowance, transactions, child, catagories) => {
    let childArrayData = [];
    let childData = {
        child_id: child.child_id,
        name: child.name,
        balance: 0,
    };
    catagories.forEach(category => {
        childData[category] = 0;
    });
    childData.balance = Number(allowance.allowance);
    transactions.forEach(transaction => {
        if (catagories.includes(transaction.category))
            childData[transaction.category] += Number(transaction.transfer_amount);
        else
            childData["Other"] += Number(transaction.transfer_amount);
        // childData.balance += Number(transaction.transfer_amount);
    });
    childArrayData.push(childData);
    return childArrayData;
};

drawChart = (childArrayData, catagories) => {
    let options_fullStacked = {
        isStacked: 'true',
        height: 300,
        legend: { position: 'top', maxLines: 1 },
        bar: { groupWidth: '75%' },
        hAxis: {
            minValue: 0,
            ticks: [0, .3, .6, .9, 1]
        }
    };
    const spinnerBorder = document.getElementsByClassName('spinner-border')[0];
    try {
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Child');
        // data.addColumn('number', 'Balance');
        catagories.forEach(category => {
            data.addColumn('number', category);
        });
        data.addRows(childArrayData.map(child => {
            return [child.name, ...catagories.map(category => child[category])];
        }));
        let chart = new google.visualization.ColumnChart(document.getElementById('fullStacked'));
        spinnerBorder.style.display = 'none';
        chart.draw(data, options_fullStacked);
    }
    catch (error) {
        throw new Error('Error drawing chart:', error);
    }
};

popOverEnable = () => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
};