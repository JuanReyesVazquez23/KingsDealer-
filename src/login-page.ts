export function initLoginPage(): void {
  const form = document.getElementById('loginForm');
  const btn = document.getElementById('loginBtn') as HTMLButtonElement | null;
  if (form && btn) {
    form.addEventListener('submit', () => {
      btn.disabled = true;
      btn.textContent = 'Verificando…';
    });
  }
}

export function togglePw(): void {
  const inp = document.getElementById('password') as HTMLInputElement | null;
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}
