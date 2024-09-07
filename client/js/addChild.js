const url = `http://localhost:5001`;

window.onload = () => {
    addChild(); 
};

const addChild = () => {
    const addChildForm = document.getElementById('addChildForm');
    
    if (addChildForm) {
        addChildForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            const formData = new FormData(event.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const parent_id = document.cookie.split('accountId=')[1]; 

            if (!name || !email || !password) {
                console.error('Please fill out all fields.');
                alert('All fields are required to add a child.');
                return;
            }

            try {
                const response = await fetch(`${url}/api/children/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        name,
                        parent_id,
                    }),
                });

                const data = await response.json();
                
                if (response.ok) {
                    console.log(data);
                    document.cookie = `childId=${data.childId}`; 
                    window.location.href = 'addNewWallet.html';
                } else {
                    console.error('Error adding child:', data.error || 'Unknown error');
                    alert('Error adding child: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error adding child:', error);
                alert('Error adding child. Please try again later.');
            }
        });
    }
};


