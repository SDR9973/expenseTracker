const url = 'https://expensetracker-qi9u.onrender.com';

window.onload = async () => {
    try {
        pageCheck();
        const allowance = await getAllowance();
        const transactions = await getTransactions();
        const children = await getChildren();
        const catagories = await getCategories();
        const childArrayData = loadList(allowance, transactions, children, catagories);
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => drawChart(childArrayData, catagories, children.length));
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
    if (!parentId) {
        console.error('Parent ID not found in cookies');
        throw new Error('Parent ID not found in cookies');
    }
};

getAllowance = async () => {
    const parentId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/wallets/all/${parentId}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching allowance:', error);
    }
};

getTransactions = async () => {
    const parentId = cookies['accountId'];
    const month = cookies['month'];
    try {
        const response = await fetch(`${url}/api/transactions/parent/${parentId}/month/${month}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error('Error fetching transactions:', error);
    }
};

getChildren = async () => {
    const parentId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/parents/${parentId}/children`);
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

loadList = (allowance, transactions, children, catagories) => {
    let childArrayData = [];
    children.forEach(child => {
        let childData = {
            child_id: child.child_id,
            name: child.name,
            balance: 0,
        };
        catagories.forEach(category => {
            childData[category] = 0;
        });
        let findAllowance = allowance.find(wallet => wallet.child_id === child.child_id);
        if (!findAllowance) {
            return;
        }
        childData.balance = Number(findAllowance.allowance);
        transactions.forEach(transaction => {
            if (transaction.child_id === child.child_id) {
                if (catagories.includes(transaction.category))
                    childData[transaction.category] += Number(transaction.transfer_amount);
                else
                    childData["Other"] += Number(transaction.transfer_amount);
                // childData.balance += Number(transaction.transfer_amount);
            };
        });
        childArrayData.push(childData);
    });
    return childArrayData;
};

drawChart = (childArrayData, catagories, numberOfChildren) => {
    let options_fullStacked = {
        isStacked: 'true',
        height: 300,
        legend: { position: 'top', maxLines: Number(numberOfChildren) },
        bar: { groupWidth: '75%' },
        hAxis: {
            minValue: 0,
            ticks: [0, .3, .6, .9, 1]
        }
    };
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
        chart.draw(data, options_fullStacked);
    }
    catch (error) {
        throw new Error('Error drawing chart:', error);
    }
};