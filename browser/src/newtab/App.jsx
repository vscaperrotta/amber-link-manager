import { useLinks } from '@utils/useLinks';
import { useAuth } from '@contexts/AuthContext.jsx';
import FullscreenLoader from '@newtab/components/FullscreenLoader.jsx';
import Header from '@components/Header';
import Main from '@newtab/components/Main.jsx';


export default function App() {
  const { user, authReady } = useAuth();
  const { loading: linksLoading } = useLinks();

  const showLoader = !authReady || linksLoading;

  return (
    <div className="newtab__container">
      {showLoader ? (
        <FullscreenLoader />
      ) : null}
      <Header auth={user} />
      <Main auth={user} />
    </div>
  );
}
