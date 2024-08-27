window.onload = () => {
    getChildren();
    getTransactions();
    filterByMonth();
}

getChildren = () => {
    fetch('/api/children')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const childrenList = document.getElementById('childrenList');
            data.forEach(child => {
                const childElement = document.createElement('li');
                childElement.innerHTML = child.name;
                childrenList.appendChild(childElement);
            });
        });
}

getTrasactions = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (month === undefined) {
        month = new Date().getMonth();
    }

    fetch(`/api/transactions/child/${childId}/month/${month}`)
}

filterByMonth = () => {
    const selectElement = document.getElementById('monthSelect');

    selectElement.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        // Do something with the selected value
        console.log(`Selected value: ${selectedValue}`);
        // Add your custom logic here
    });
}