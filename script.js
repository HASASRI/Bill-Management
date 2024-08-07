// Initialize bill data
const storageKey = 'bills';
let bills = JSON.parse(localStorage.getItem(storageKey)) || [];

// Function to save bills to localStorage
function saveBills() {
    localStorage.setItem(storageKey, JSON.stringify(bills));
}

// Function to add bill to table
function addBillToTable(bill) {
    const table = document.getElementById('billsTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.insertCell().textContent = bill.billNumber;
    row.insertCell().textContent = bill.date;
    row.insertCell().textContent = bill.amount;
    row.insertCell().textContent = bill.description;
    row.insertCell().textContent = bill.category;
}

// Function to render all bills to table
function renderBills() {
    const table = document.getElementById('billsTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear table
    bills.forEach(addBillToTable);
}

// Handle form submission
document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const bill = {
        billNumber: document.getElementById('billNumber').value,
        date: document.getElementById('date').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    };
    
    bills.push(bill);
    saveBills();
    addBillToTable(bill);
    
    // Clear form
    this.reset();
});

// Handle clear all button click
document.getElementById('clearAll').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all bills?')) {
        bills = [];
        saveBills();
        renderBills();
    }
});

// Generate report
document.getElementById('generateReport').addEventListener('click', function() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    const reportTable = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
    reportTable.innerHTML = ''; // Clear previous report

    bills.filter(bill => {
        const billDate = new Date(bill.date);
        return billDate >= startDate && billDate <= endDate;
    }).forEach(bill => {
        const row = reportTable.insertRow();
        row.insertCell().textContent = bill.billNumber;
        row.insertCell().textContent = bill.date;
        row.insertCell().textContent = bill.amount;
        row.insertCell().textContent = bill.description;
        row.insertCell().textContent = bill.category;
    });
});

// Download report as CSV
document.getElementById('downloadReport').addEventListener('click', function() {
    const table = document.getElementById('reportTable');
    const rows = table.querySelectorAll('tr');
    const csv = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => csvRow.push('"' + col.innerText.replace(/"/g, '""') + '"'));
        csv.push(csvRow.join(','));
    });

    const csvString = csv.join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    link.download = 'report.csv';
    link.click();
});

// Render bills on page load
renderBills();
