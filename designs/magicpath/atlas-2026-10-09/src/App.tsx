import { Theme } from './settings/types';
import { ClienteloSrovnNETF } from './components/generated/ClienteloSrovnNETF';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return (
    <>
      <ClienteloSrovnNETF />
    </>
  ); // %EXPORT_STATEMENT%
}

export default App;
