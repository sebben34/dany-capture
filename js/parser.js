function danySmartParse(text) {
  const lower = text.toLowerCase();
  const result = {
    type: 'consommable',
    title: text,
    note: text,
    qty: '',
    status: 'info'
  };

  const qty = lower.match(/\b\d+\b/);
  if (qty) result.qty = qty[0];

  if (lower.includes('quatre')) result.qty = '4';
  if (lower.includes('trois')) result.qty = '3';
  if (lower.includes('deux')) result.qty = '2';
  if (lower.includes('une') || lower.includes('un')) result.qty = '1';

  if (lower.includes('machine') || lower.includes('outil') || lower.includes('perceuse') || lower.includes('ponceuse') || lower.includes('disqueuse')) {
    result.type = 'materiel';
  }

  if (lower.includes('note') || lower.includes('rappel')) {
    result.type = 'note';
  }

  if (lower.includes('commander') || lower.includes('manque') || lower.includes('termine') || lower.includes('terminé')) {
    result.status = 'a_commander';
  }

  if (lower.includes('recu') || lower.includes('reçu')) {
    result.status = 'recu';
  }

  if (lower.includes('commande faite') || lower.includes('commandé')) {
    result.status = 'commande';
  }

  let title = text;
  title = title.replace(/il faut/gi, '');
  title = title.replace(/commander/gi, '');
  title = title.replace(/urgent/gi, '');
  title = title.replace(/terminé/gi, '');
  title = title.replace(/termine/gi, '');
  title = title.replace(/\b\d+\b/g, '');
  title = title.trim();

  if (title.length > 45) title = title.slice(0, 45).trim() + '...';
  result.title = title || 'Capture vocale';

  return result;
}
