let allRecords = [];

// Utility function to show or hide error messages.
function showError(msg) {
  const errorEl = document.getElementById('error');
  if (msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  } else {
    errorEl.style.display = 'none';
  }
}

// Function to render the table with all columns from the table.
function renderTable(mappedRecords) {
  const headerRow = document.getElementById('table-header');
  const tbody = document.getElementById('table-body');
  headerRow.innerHTML = '';
  tbody.innerHTML = '';

  if (mappedRecords.length === 0) {
    showError("No records found.");
    return;
  }
  showError("");

  // Use all keys from the first record as column headers.
  const columns = Object.keys(mappedRecords[0]);
  
  // Build table header.
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  
  // Build table rows.
  mappedRecords.forEach(record => {
    const tr = document.createElement('tr');
    // When a row is clicked, update the Grist cursor.
    tr.addEventListener('click', function() {
      grist.setCursorPos({ rowId: record.id });
    });
    
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = record[col] !== undefined ? record[col] : '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Function to render the details of the selected record.
function renderDetails(record) {
  const detailsEl = document.getElementById('details');
  detailsEl.textContent = JSON.stringify(record, null, 2);
}

// Initialize the widget.
function initGrist() {
  grist.ready({
    // No specific column mapping is specified so that all columns are available.
    requiredAccess: 'read table',
    allowSelectBy: true,
  });

  // Fetch and map all records, then display them.
  grist.onRecords(function(records) {
    if (!records || records.length === 0) {
      showError("No records received.");
      return;
    }
    allRecords = records;
    // Map all columns from records.
    const mapped = grist.mapColumnNames(records);
    renderTable(mapped);
  });

  // When the selected row (cursor) changes, fetch the full record and display details.
  grist.onRecord(async function(record) {
    if (!record) return;
    // Fetch full record (all columns) from the document.
    const fullRecord = await grist.docApi.fetchSelectedRecord(record.id);
    renderDetails(fullRecord);
  });
}

// Initialize the widget when the page loads.
document.addEventListener('DOMContentLoaded', initGrist);
