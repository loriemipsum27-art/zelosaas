import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export function initDash() {
  console.log('DASH INICIADO 🔥')

  const supabaseUrl = 'https://zxczmbcjjohyghskvlfh.supabase.co'

  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y3ptYmNqam9oeWdoc2t2bGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzIyNDMsImV4cCI6MjA5MzkwODI0M30.drnfReEhmCR1G2bWo3uJAFY2ZKdJD-nWLnfK-i1RUY8'

  const supabaseClient = createClient(supabaseUrl, supabaseKey)

  /* VERIFICAR LOGIN */

  async function checkAuth() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession()

  /* SEM LOGIN */

  if (!session) {

    window.location.href = '/index.html'
    return
  }

  /* LOGADO */

  document.body.style.display = 'block'

  console.log('Logado 🚀', session.user.email)

  /* OUVIR AUTH */

  supabaseClient.auth.onAuthStateChange((event, session) => {

    console.log('Auth event:', event)

    if (event === 'SIGNED_OUT') {

      window.location.href = '/index.html'
    }

  })

}

  checkAuth()

  /* LOGOUT */

  const logoutBtn = document.getElementById('logout-btn')

  if (!logoutBtn) return

  logoutBtn.addEventListener('click', async () => {

    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      alert(error.message)
      return
    }

    window.location.href = '/index.html'
  })
}