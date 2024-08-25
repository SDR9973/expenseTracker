let data = {
    resource_id: '6f3bda2a-8cde-4b86-a1c8-2761862b1224',
  };
  
  let url = new URL('https://data.gov.il/api/3/action/datastore_search');
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
  
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
  
  function populateBankDropdown(bank_names_set) {
    const bankSelect = document.getElementById('bankSelect');
  
    bank_names_set.forEach(bankName => {
      const option = document.createElement('option');
      option.value = bankName;
      option.textContent = bankName;
      bankSelect.appendChild(option);
    });
  }
  
  fetchData();
  