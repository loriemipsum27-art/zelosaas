import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export function initAuth() {
  console.log('Auth INICIADO 🔥')

  const supabaseUrl = 'https://zxczmbcjjohyghskvlfh.supabase.co'

  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y3ptYmNqam9oeWdoc2t2bGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzIyNDMsImV4cCI6MjA5MzkwODI0M30.drnfReEhmCR1G2bWo3uJAFY2ZKdJD-nWLnfK-i1RUY8'

  const supabaseClient = createClient(
    supabaseUrl,
    supabaseKey
  )

  const form = document.getElementById('cta-form')

  if (!form) return

  /* LOGIN */

  form.addEventListener('submit', async (e) => {

    e.preventDefault()

    const email = document.getElementById('cta-email').value

    const button = form.querySelector('button')

    button.innerText = 'A criar conta...'
    button.disabled = true

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        // ✅ CORRIGIDO: aponta para o dashboard, não para o index
        emailRedirectTo: 'http://127.0.0.1:5500/dashboard.html'
      }
    })

    if (error) {

      alert(error.message)

      button.innerText = 'Começar grátis'
      button.disabled = false

      return
    }

    alert('Verifica o teu email 🚀')

    button.innerText = 'Email enviado!'
  })

  /* VERIFICAR SESSÃO */
  // ✅ CORRIGIDO: onAuthStateChange em vez de getSession()
  // getSession() não deteta o token do magic link a tempo
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if ( event === 'SIGNED_IN' && session) {
      window.location.href = '/dashboard.html'
    }
  })
}