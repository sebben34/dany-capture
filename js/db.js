const DANY_DB_KEY = 'dany_capture_items_v01';

function getCaptures() {
  try {
    return JSON.parse(localStorage.getItem(DANY_DB_KEY)) || [];
  } catch (error) {
    console.error('Lecture localStorage impossible', error);
    return [];
  }
}

function saveCaptures(items) {
  localStorage.setItem(DANY_DB_KEY, JSON.stringify(items));
}

function makeId() {
  return 'cap-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function addCapture(item) {
  const items = getCaptures();
  const nextItem = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    synced: false,
    ...item
  };
  items.unshift(nextItem);
  saveCaptures(items);
  return nextItem;
}

function clearCaptures() {
  localStorage.removeItem(DANY_DB_KEY);
}

function csvEscape(value) {
  const text = String(value || '');
  return '"' + text.split('"').join('""') + '"';
}

function buildCapturesCsv(items) {
  const headers = ['date', 'type', 'titre', 'detail', 'quantite', 'statut'];
  const rows = items.map(function(item) {
    return [
      new Date(item.createdAt).toLocaleString('fr-FR'),
      item.type,
      item.title,
      item.note,
      item.qty,
      item.status
    ];
  });

  return [headers].concat(rows).map(function(row) {
    return row.map(csvEscape).join(';');
  }).join('\n');
}
