document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('receipt-form');
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('result-card');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const receiptFile = document.getElementById('receipt').files[0];
        if (!receiptFile) {
            alert('Please select a receipt image');
            return;
        }

        // Show loading state
        loading.style.display = 'block';
        resultCard.style.display = 'none';

        // Create form data
        const formData = new FormData();
        formData.append('receipt', receiptFile);

        try {
            const response = await fetch('/parse-receipt/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                displayResults(result.data);
            } else {
                alert('Failed to parse receipt: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error parsing receipt: ' + error.message);
        } finally {
            loading.style.display = 'none';
        }
    });

    function displayResults(data) {
        // Update basic info
        document.getElementById('merchant').textContent = data.merchant_name || 'N/A';
        document.getElementById('date').textContent = data.date || 'N/A';
        document.getElementById('total').textContent = data.total ? `${data.total}` : 'N/A';
        document.getElementById('currency').textContent = data.currency || 'N/A';

        // Update items list
        const itemsList = document.getElementById('items');
        itemsList.innerHTML = '';
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                itemsList.appendChild(li);
            });
        } else {
            itemsList.innerHTML = '<li>No items found</li>';
        }

        // Update additional info
        const additionalInfo = document.getElementById('additional-info');
        let additionalText = '';
        if (data.tax) additionalText += `Tax: ${data.tax}\n`;
        if (data.discount) additionalText += `Discount: ${data.discount}\n`;
        additionalInfo.textContent = additionalText || 'No additional information available';

        // Show results
        resultCard.style.display = 'block';
    }
});