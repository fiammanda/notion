
const today = new Date();

const dark = window.matchMedia('(prefers-color-scheme: dark)').matches || (window.matchMedia('(hover: hover)').matches && (today.getHours() < 8 || today.getHours() > 18));
if (localStorage.getItem('theme')) {
  document.documentElement.classList.toggle('dark', localStorage.theme === 'dark');
} else {
  document.documentElement.classList.toggle('dark', dark);
}
document.querySelector('.theme').addEventListener('click', () => {
  if (localStorage.getItem('theme')) {
    if (dark !== (localStorage.theme === 'dark')) {
      localStorage.removeItem('theme');
    } else {
      localStorage.theme = dark ? 'light' : 'dark';
    }
  } else {
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  }
  document.documentElement.classList.toggle('dark');
});
