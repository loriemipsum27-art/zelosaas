import { closeModal, openModal } from '../components/modal.js';
import { showErrorAlert } from '../components/alerts.js';
import { getState, setCurrentProfile } from '../core/state.js';
import { sb } from '../core/supabase.js';

export async function loadProfile() {
  const { currentUser } = getState();

  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

    console.log('PROFILE DATA:', data);
console.log('PROFILE ERROR:', error);

  if (!error && data) {
    setCurrentProfile(data);

    const initials = (data.nome || currentUser.email)
      .split(' ')
      .slice(0, 2)
      .map((name) => name[0])
      .join('')
      .toUpperCase();

    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('greetingText').textContent = `Olá, ${data.nome.split(' ')[0]} 👋`;
    
  }
}

export function openProfile() {
  const { currentProfile, currentUser } = getState();
  const profile = currentProfile || {};
  const profileForm = document.getElementById('profileForm');

  if (!profileForm) {
    return;
  }

  profileForm.innerHTML = `
    <div>
      <label>Nome completo</label>
      <input type="text" id="pfNome" value="${profile.nome || ''}" placeholder="O teu nome">
    </div>
    <div>
      <label>Telefone</label>
      <input type="tel" id="pfTelefone" value="${profile.telefone || ''}" placeholder="+244 9XX XXX XXX">
    </div>
    <div>
      <label>Morada</label>
      <input type="text" id="pfMorada" value="${profile.morada || ''}" placeholder="A tua morada">
    </div>
    <div class="profile-email">
      Email: <strong>${currentUser.email}</strong>
    </div>
    <button class="btn-primary btn-primary--full u-mt-8" data-action="save-profile">
      Guardar alterações
    </button>
  `;

  openModal('profileModal');
}

export async function saveProfile() {
  const { currentUser } = getState();
  const nome = document.getElementById('pfNome').value.trim();
  const telefone = document.getElementById('pfTelefone').value.trim();
  const morada = document.getElementById('pfMorada').value.trim();

  const { error } = await sb
    .from('profiles')
    .update({
      nome,
      telefone,
      morada,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentUser.id);

  if (!error) {
    closeModal('profileModal');
    await loadProfile();
  } else {
    showErrorAlert(`Erro ao guardar: ${error.message}`);
  }
}

let profileEventsBound = false;

export function bindProfileEvents() {
  if (profileEventsBound) {
    return;
  }

  profileEventsBound = true;

  document.getElementById('userAvatar')?.addEventListener('click', openProfile);

  document.getElementById('profileForm')?.addEventListener('click', async (event) => {
    const saveTrigger = event.target.closest('[data-action="save-profile"]');

    if (saveTrigger) {
      await saveProfile();
    }
  });
}
