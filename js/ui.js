const statusLabels = {
  a_commander: 'À commander',
  commande: 'Commandé',
  recu: 'Reçu',
  info: 'Info'
};

const typeLabels = {
  consommable: 'Consommable',
  materiel: 'Matériel',
  chantier: 'Chantier',
  note: 'Note'
};

function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderCaptures() {
  const list = document.getElementById('captureList');
  const count = document.getElementById('captureCount');
  const template = document.getElementById('captureTemplate');
  const items = getCaptures();

  count.textContent = String(items.length);
  list.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Aucune capture pour le moment.';
    list.appendChild(empty);
    return;
  }

  items.forEach(function(item) {
    const node = template.content.cloneNode(true);
    const article = node.querySelector('.capture-item');
    const meta = node.querySelector('.capture-meta');
    const title = node.querySelector('h3');
    const note = node.querySelector('.capture-note');
    const badge = node.querySelector('.badge');

    meta.textContent = formatDate(item.createdAt) + ' · ' + (typeLabels[item.type] || item.type) + (item.qty ? ' · Qté ' + item.qty : '');
    title.textContent = item.title || 'Sans titre';
    note.textContent = item.note || '';
    badge.textContent = statusLabels[item.status] || item.status;
    badge.dataset.status = item.status;
    article.dataset.id = item.id;

    list.appendChild(node);
  });
}

function updateConnectionStatus() {
  const status = document.getElementById('connectionStatus');
  if (!status) return;
  status.textContent = navigator.onLine ? 'En ligne' : 'Hors-ligne prêt';
}
