(() => {
  const SUPABASE_URL = 'https://svsrwcthvssuzuoqrzsf.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_rMhi3iySIR_bplTEHxV04Q_iebipFZp';

  const start = () => {
    if (!window.supabase || !document.getElementById('accountBtn')) return;

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    const style = document.createElement('style');
    style.textContent = `
      .auth-modal{position:fixed;inset:0;background:rgba(10,18,30,.58);display:none;align-items:center;justify-content:center;padding:20px;z-index:10000}
      .auth-modal.open{display:flex}.auth-box{width:min(430px,100%);background:#fff;border-radius:18px;padding:28px;box-shadow:0 20px 70px rgba(0,0,0,.25);position:relative}
      .auth-box h2{margin:0 0 6px}.auth-box p{margin:0 0 20px;color:#667085}.auth-close{position:absolute;right:14px;top:10px;border:0;background:transparent;font-size:28px;cursor:pointer}
      .auth-tabs{display:flex;gap:8px;margin-bottom:18px}.auth-tab{flex:1;border:1px solid #d0d5dd;background:#fff;padding:10px;border-radius:10px;cursor:pointer;font-weight:700}.auth-tab.active{background:#111827;color:#fff}
      .auth-form{display:grid;gap:12px}.auth-form label{font-size:13px;font-weight:700}.auth-form input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #d0d5dd;border-radius:10px;font:inherit}.auth-submit{border:0;background:#111827;color:#fff;padding:12px;border-radius:10px;font-weight:800;cursor:pointer}.auth-submit:disabled{opacity:.6;cursor:not-allowed}
      .auth-message{font-size:14px;min-height:20px}.auth-message.error{color:#b42318}.auth-message.success{color:#027a48}.auth-user{display:flex;align-items:center;gap:8px}.auth-user button{border:0;background:#f2f4f7;padding:8px 12px;border-radius:9px;cursor:pointer;font-weight:700}
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-box" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <button class="auth-close" type="button" aria-label="Close">×</button>
        <h2 id="authTitle">Welcome to MRK Store</h2>
        <p id="authSubtitle">Sign in to save your shopping preferences.</p>
        <div class="auth-tabs">
          <button class="auth-tab active" data-mode="signin" type="button">Sign In</button>
          <button class="auth-tab" data-mode="signup" type="button">Create Account</button>
        </div>
        <form class="auth-form" id="authForm">
          <div><label for="authEmail">Email</label><input id="authEmail" type="email" autocomplete="email" required></div>
          <div><label for="authPassword">Password</label><input id="authPassword" type="password" autocomplete="current-password" minlength="6" required></div>
          <button class="auth-submit" type="submit">Sign In</button>
          <button id="forgotPassword" type="button" style="border:0;background:none;text-decoration:underline;cursor:pointer;justify-self:start;padding:0">Forgot password?</button>
          <div class="auth-message" id="authMessage" aria-live="polite"></div>
        </form>
      </div>`;
    document.body.appendChild(modal);

    const accountBtn = document.getElementById('accountBtn');
    const form = document.getElementById('authForm');
    const message = document.getElementById('authMessage');
    const submit = form.querySelector('.auth-submit');
    const email = document.getElementById('authEmail');
    const password = document.getElementById('authPassword');
    const forgot = document.getElementById('forgotPassword');
    let mode = 'signin';

    const setMessage = (text, type = '') => { message.textContent = text; message.className = `auth-message ${type}`; };
    const open = () => { modal.classList.add('open'); email.focus(); };
    const close = () => { modal.classList.remove('open'); setMessage(''); };

    const renderAccount = (user) => {
      if (user) {
        const label = user.email ? user.email.split('@')[0] : 'Account';
        accountBtn.innerHTML = `<small>Signed in</small><strong>${label} ▾</strong>`;
        accountBtn.title = 'Open account menu';
      } else {
        accountBtn.innerHTML = '<small>MRK Store</small><strong>Sign In / Account ▾</strong>';
        accountBtn.title = 'Sign in or create an account';
      }
    };

    const setMode = (next) => {
      mode = next;
      document.querySelectorAll('.auth-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
      submit.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
      forgot.style.display = mode === 'signin' ? 'block' : 'none';
      document.getElementById('authSubtitle').textContent = mode === 'signin' ? 'Sign in to save your shopping preferences.' : 'Create your free MRK Store account.';
      password.autocomplete = mode === 'signin' ? 'current-password' : 'new-password';
      setMessage('');
    };

    accountBtn.addEventListener('click', async () => {
      const { data } = await client.auth.getUser();
      if (data.user) {
        if (confirm(`Signed in as ${data.user.email}.\n\nPress OK to sign out.`)) {
          await client.auth.signOut();
          renderAccount(null);
        }
      } else open();
    });

    document.querySelectorAll('.auth-tab').forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
    modal.querySelector('.auth-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      submit.disabled = true;
      setMessage('Please wait…');
      try {
        if (mode === 'signin') {
          const { error } = await client.auth.signInWithPassword({ email: email.value.trim(), password: password.value });
          if (error) throw error;
          setMessage('Signed in successfully.', 'success');
          setTimeout(close, 500);
        } else {
          const { data, error } = await client.auth.signUp({ email: email.value.trim(), password: password.value });
          if (error) throw error;
          if (data.session) {
            setMessage('Account created and signed in.', 'success');
            setTimeout(close, 700);
          } else {
            setMessage('Account created. Check your email to confirm your address.', 'success');
          }
        }
      } catch (error) {
        setMessage(error.message || 'Authentication failed.', 'error');
      } finally { submit.disabled = false; }
    });

    forgot.addEventListener('click', async () => {
      const address = email.value.trim();
      if (!address) { setMessage('Enter your email address first.', 'error'); return; }
      try {
        const { error } = await client.auth.resetPasswordForEmail(address, { redirectTo: window.location.origin });
        if (error) throw error;
        setMessage('Password reset email sent. Check your inbox.', 'success');
      } catch (error) { setMessage(error.message || 'Could not send reset email.', 'error'); }
    });

    client.auth.onAuthStateChange((_event, session) => renderAccount(session?.user || null));
    client.auth.getUser().then(({ data }) => renderAccount(data.user || null));
  };

  if (window.supabase) start();
  else window.addEventListener('load', start, { once: true });
})();
