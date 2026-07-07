let danyRecognition = null;
let danyIsListening = false;

const numberWords = {
  un: 1,
  une: 1,
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  six: 6,
  sept: 7,
  huit: 8,
  neuf: 9,
  dix: 10,
  onze: 11,
  douze: 12,
  treize: 13,
  quatorze: 14,
  quinze: 15,
  vingt: 20
};

function getSpeechApi() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function detectStatus(text) {
  const value = text.toLowerCase();
  if (value.includes('reçu') || value.includes('recu') || value.includes('arrivé') || value.includes('arrive')) return 'recu';
  if (value.includes('commandé') || value.includes('commande faite')) return 'commande';
  if (value.includes('à commander') || value.includes('a commander') || value.includes('commander') || value.includes('terminé') || value.includes('termine') || value.includes('manque')) return 'a_commander';
  return 'info';
}

function detectType(text) {
  const value = text.toLowerCase();
  if (value.includes('machine') || value.includes('outil') || value.includes('perceuse') || value.includes('ponceuse') || value.includes('échafaudage')) return 'materiel';
  if (value.includes('chantier') || value.includes('client') || value.includes('adresse')) return 'chantier';
  if (value.includes('note') || value.includes('rappel')) return 'note';
  return 'consommable';
}

function detectQty(text) {
  const value = text.toLowerCase();
  const digitMatch = value.match(/\b\d+\b/);
  if (digitMatch) return digitMatch[0];
  for (const word in numberWords) {
    if (value.includes(' ' + word + ' ') || value.startsWith(word + ' ') || value.endsWith(' ' + word)) {
      return String(numberWords[word]);
    }
  }
  return '';
}

function cleanTitle(text) {
  let value = text.trim();
  value = value.replace(/^(il faut|faut|penser à|pense à|ajoute|ajouter|note|rappel|commander)\s+/i, '');
  value = value.replace(/\b(à commander|a commander|commandé|commande faite|reçu|recu|urgent|terminé|termine|il reste|reste)\b/gi, '');
  value = value.replace(/\s+/g, ' ').trim();
  if (value.length > 42) return value.slice(0, 42).trim() + '...';
  return value || 'Capture vocale';
}

function fillFormFromSpeech(text) {
  const transcript = text.trim();
  document.getElementById('captureType').value = detectType(transcript);
  document.getElementById('captureTitle').value = cleanTitle(transcript);
  document.getElementById('captureNote').value = transcript;
  document.getElementById('captureQty').value = detectQty(transcript);
  document.getElementById('captureStatus').value = detectStatus(transcript);
}

function setVoiceButtonState(isListening) {
  const button = document.getElementById('voiceBtn');
  const feedback = document.getElementById('voiceFeedback');
  if (!button || !feedback) return;
  button.classList.toggle('listening', isListening);
  button.textContent = isListening ? '🎙️ J’écoute...' : '🎤 PARLER';
  feedback.textContent = isListening ? 'Parle maintenant, Dany remplit le formulaire.' : 'Appuie, parle, puis vérifie avant d’enregistrer.';
}

function startVoiceCapture() {
  const SpeechApi = getSpeechApi();
  const feedback = document.getElementById('voiceFeedback');
  if (!SpeechApi) {
    if (feedback) feedback.textContent = 'Dictée non supportée sur ce navigateur. Essaie Chrome Android.';
    return;
  }

  if (danyIsListening && danyRecognition) {
    danyRecognition.stop();
    return;
  }

  danyRecognition = new SpeechApi();
  danyRecognition.lang = 'fr-FR';
  danyRecognition.interimResults = false;
  danyRecognition.maxAlternatives = 1;

  danyRecognition.onstart = function() {
    danyIsListening = true;
    setVoiceButtonState(true);
  };

  danyRecognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    fillFormFromSpeech(transcript);
  };

  danyRecognition.onerror = function(event) {
    if (feedback) feedback.textContent = 'Erreur micro : ' + event.error;
  };

  danyRecognition.onend = function() {
    danyIsListening = false;
    setVoiceButtonState(false);
  };

  danyRecognition.start();
}

function setupSpeechCapture() {
  const button = document.getElementById('voiceBtn');
  if (!button) return;
  button.addEventListener('click', startVoiceCapture);
}
