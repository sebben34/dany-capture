import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Camera, MapPin, Mic, Package, Wrench } from 'lucide-react';
import './styles.css';

const todayJob = {
  client: 'Résidence Bacardi',
  address: 'Rue fictive du chantier, 34300 Agde',
  contact: 'Seb',
  phone: '06 09 72 89 37',
  start: '08:00',
  reminders: ['Passer chez Lopez récupérer la commande', 'Photos avant travaux obligatoires', 'Vérifier les consommables avant départ'],
  tasks: ['Protection des zones', 'Préparation support', 'Application peinture', 'Nettoyage chantier'],
  materials: ['Sikaflex blanc', 'Scotch orange', 'Bâches', 'Enduit de rebouchage', 'Rouleaux laqueur'],
  access: 'Prévoir stationnement utilitaire. Appeler Seb si accès bloqué.'
};

const weekJobs = [
  { day: 'Aujourd’hui', title: todayJob.client, time: '08:00', city: 'Agde' },
  { day: 'Demain', title: 'SA Patrimoine - contrôle', time: '09:00', city: 'Sérignan' },
  { day: 'Vendredi', title: 'Atelier - préparation matériel', time: '14:00', city: 'Vias' }
];

function openWaze(address) {
  const url = 'https://waze.com/ul?q=' + encodeURIComponent(address) + '&navigate=yes';
  window.open(url, '_blank');
}

function App() {
  const [screen, setScreen] = useState('home');
  const [captures, setCaptures] = useState([]);
  const [lastMessage, setLastMessage] = useState('Prêt à écouter.');

  const stats = useMemo(() => ({ captures: captures.length, photos: captures.filter(c => c.type.includes('photo')).length }), [captures]);

  function addCapture(type, label) {
    const item = { id: Date.now(), type, label, date: new Date().toLocaleString('fr-FR') };
    setCaptures([item, ...captures]);
    setLastMessage(label);
  }

  function fakeVoiceCapture() {
    addCapture('vocal', 'Capture vocale enregistrée localement.');
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">SOS Peinture & Réparation</p>
          <h1>Dany Terrain</h1>
          <p>Mode Alban : planning, chantier, photos et rappels.</p>
        </div>
        <span className="pill">V1</span>
      </header>

      <nav className="tabs">
        <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>Accueil</button>
        <button className={screen === 'planning' ? 'active' : ''} onClick={() => setScreen('planning')}>Planning</button>
        <button className={screen === 'job' ? 'active' : ''} onClick={() => setScreen('job')}>Chantier</button>
      </nav>

      {screen === 'home' && (
        <section className="screen">
          <button className="talkButton" onClick={fakeVoiceCapture}>
            <Mic size={56} />
            <span>PARLER</span>
          </button>

          <div className="quickGrid">
            <button onClick={() => setScreen('planning')}><CalendarDays /> Planning</button>
            <button onClick={() => setScreen('job')}><MapPin /> Chantier du jour</button>
            <button onClick={() => addCapture('photo_avant', 'Photo avant chantier à synchroniser Drive.')}><Camera /> Photo avant</button>
            <button onClick={() => addCapture('materiel', 'Matériel manquant signalé.')}><Package /> Matériel manquant</button>
          </div>

          <article className="card highlight">
            <h2>Dernière info</h2>
            <p>{lastMessage}</p>
            <small>{stats.captures} capture(s), {stats.photos} photo(s)</small>
          </article>
        </section>
      )}

      {screen === 'planning' && (
        <section className="screen">
          <h2>Planning</h2>
          {weekJobs.map(job => (
            <article className="card jobRow" key={job.day} onClick={() => setScreen('job')}>
              <div>
                <strong>{job.day}</strong>
                <p>{job.title}</p>
              </div>
              <span>{job.time} · {job.city}</span>
            </article>
          ))}
        </section>
      )}

      {screen === 'job' && (
        <section className="screen">
          <article className="card jobHero">
            <p className="eyebrow">Chantier du jour</p>
            <h2>{todayJob.client}</h2>
            <p>{todayJob.address}</p>
            <button className="waze" onClick={() => openWaze(todayJob.address)}>Ouvrir Waze</button>
          </article>

          <div className="quickGrid">
            <button onClick={() => addCapture('photo_avant', 'Photo avant chantier enregistrée.')}><Camera /> Photos avant</button>
            <button onClick={() => addCapture('photo_apres', 'Photo après chantier enregistrée.')}><Camera /> Photos après</button>
            <button onClick={() => addCapture('probleme', 'Problème signalé à Seb.')}><Wrench /> Signaler problème</button>
            <button onClick={() => addCapture('stock', 'Consommable à commander.')}><Package /> Consommables</button>
          </div>

          <InfoBlock title="Rappels" items={todayJob.reminders} />
          <InfoBlock title="Travaux à faire" items={todayJob.tasks} />
          <InfoBlock title="Matériel prévu" items={todayJob.materials} />

          <article className="card">
            <h3>Accès / consignes</h3>
            <p>{todayJob.access}</p>
          </article>
        </section>
      )}

      <section className="screen history">
        <h2>Historique local</h2>
        {captures.length === 0 ? <p className="muted">Aucune capture V1 pour le moment.</p> : captures.map(item => (
          <article className="card mini" key={item.id}>
            <strong>{item.label}</strong>
            <small>{item.date}</small>
          </article>
        ))}
      </section>
    </main>
  );
}

function InfoBlock({ title, items }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
