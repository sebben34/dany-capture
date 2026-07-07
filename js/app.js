function readForm() {
  return {
    type: document.getElementById('captureType').value,
    title: document.getElementById('captureTitle').value.trim(),
    note: document.getElementById('captureNote').value.trim(),
    qty: document.getElementById('captureQty').value,
    status: document.getElementById('captureStatus').value
  };
}

function resetForm() {
  document.getElementById('captureTitle').value = '';
  document.getElementById('captureNote').value = '';
  document.getElementById('captureQty').value = '';
  document.getElementById('captureStatus').value = 'a_commander';
  document.getElementById('captureTitle').focus();
}

function saveCurrentCapture() {
  const item = readForm();
  if (!item.title && !item.note) {
    alert('Ajoute au moins un titre ou une note.');
    return;
  }
  addCapture(item);
  resetForm();
  renderCaptures();
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const items = getCaptures();
  if (!items.length) {
    alert('Aucune capture à exporter.');
    return;
  }
  const csv = buildCapturesCsv(items);
  const filename = 'dany-captures-' + new Date().toISOString().slice(0, 10) + '.csv';
  downloadTextFile(filename, csv, 'text/csv;charset=utf-8;');
}

function setupApp() {
  document.getElementById('saveCaptureBtn').addEventListener('click', saveCurrentCapture);
  document.getElementById('quickCaptureBtn').addEventListener('click', function() {
    document.getElementById('captureTitle').focus();
  });
  document.getElementById('exportBtn').addEventListener('click', exportCsv);
  document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Vider toutes les captures locales ?')) {
      clearCaptures();
      renderCaptures();
    }
  });

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);

  updateConnectionStatus();
  renderCaptures();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function(error) {
      console.warn('Service worker non enregistré', error);
    });
  }
}

document.addEventListener('DOMContentLoaded', setupApp);
