const url = 'https://expensetracker-qi9u.onrender.com';

window.onload = async () => {
    try {
        pageCheck();
        const currencyData = await getCurrency();
        const currentDate = getDateTime();
        const categoriesData = await getCategories();
        loadList(currencyData, currentDate, categoriesData);
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
    const childId = cookies['accountId'];
    console.log(childId);
    if (!childId) {
        console.error('Child ID not found in cookies');
        throw new Error('Child ID not found in cookies');
    }
};

getCurrency = async () => {
    const childId = cookies['accountId'];
    try {
        const response = await fetch(`${url}/api/wallets/${childId}`);
        const data = await response.json();
        return data.currency;
    }
    catch (error) {
        throw new Error('Error fetching currencies:', error);
    }
};

getDateTime = () => {
    const today = Date.now() - (new Date().getTimezoneOffset() * 60000);
    const ISOformat = new Date(today).toISOString();
    return ISOformat.slice(0, 16);
};

getCategories = async () => {
    try {
        const response = await fetch(`../data/categories.json`);
        const data = await response.json();
        return data.categories;
    }
    catch (error) {
        throw new Error('Error fetching categories:', error);
    }
}

loadList = (currencyData, currentDate, categoriesData) => {
    const currencyElement = document.getElementById('currency');
    currencyElement.innerHTML = currencyData;

    const dateElement = document.getElementById('date');
    dateElement.value = currentDate;

    const categoryElement = document.getElementById('category');
    categoriesData.forEach(category => {
        const optionElement = document.createElement('option');
        optionElement.value = category.title;
        optionElement.innerHTML = category.title;
        categoryElement.appendChild(optionElement);
    });
};

eventListeners = () => {
    document.getElementById('newIncomeForm').addEventListener(`submit`, (event) => {
        event.preventDefault();
        submitExpense(event);
    });
};

submitExpense = async (event) => {
    const formData = new FormData(event.target);
    const childId = cookies['accountId'];
    const category = formData.get('category');
    const amount = Number(formData.get('amount'));
    const description = formData.get('description');
    const datetime = formData.get('date');
    const date = datetime.split('T')[0];
    const time = datetime.split('T')[1];
    // (child_id, transfer_amount, date, time, description, category)
    const income = {
        child_id: childId,
        transfer_amount: amount,
        date: date,
        time: time,
        description: description,
        category: category
    };
    console.log(income);
    try {
        const response = await fetch(`${url}/api/transactions/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(income)
        });
        const data = await response.json();
        console.log(data);
        window.location.href = 'child.html';
    }
    catch (error) {
        console.error('Error submitting income:', error);
    }
};