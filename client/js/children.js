  
   async function fetchData() {
    try {
      let response = await fetch(url, { method: 'GET' });
      let result = await response.json();
      if (result.success === true) {
        const banks = result.result.records;
        let bank_names_set = new Set();
  
        for (let bank of banks) {
          bank_names_set.add(bank.Bank_Name);
        }
  
        populateBankDropdown(bank_names_set);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
 function populateChildrenDropdown(bank_names_set) {
    const bankSelect = document.getElementById('bankSelect');
  
    bank_names_set.forEach(bankName => {
      const option = document.createElement('option');
      option.value = bankName;
      option.textContent = bankName;
      bankSelect.appendChild(option);
    });
  }
  