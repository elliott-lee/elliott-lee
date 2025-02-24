let allRecords = [];

// Utility function to show/hide error messages.
function showError(msg) {
  const errorEl = document.getElementById('error');
  if (msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  } else {
    errorEl.style.display = 'none';
  }
}

// Render the table: build headers and rows.
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

  // Use keys from the first record as the column names.
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
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = record[col] !== undefined ? record[col] : '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Initialize the widget.
function initGrist() {
  grist.ready({
    columns: [{ name: "OptionsToSelect", title: 'Options to select', type: 'Any' }],
    requiredAccess: 'read table',
    allowSelectBy: true,
  });

  // Listen for records changes and update the table.
  grist.onRecords(function(records) {
    if (!records || records.length === 0) {
      showError("No records received.");
      return;
    }
    allRecords = records;
    const mapped = grist.mapColumnNames(records);
    renderTable(mapped);
  });
}

// Initialize when the document is loaded.
document.addEventListener('DOMContentLoaded', initGrist);
