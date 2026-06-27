import './App.css';
import { NavProvider, useNav } from './context/Nav';

import Splash from './screens/Splash';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Spaces from './screens/Spaces';
import CreateSpace from './screens/CreateSpace';
import SpaceDetailList from './screens/SpaceDetailList';
import SpaceDetailMap from './screens/SpaceDetailMap';
import SpaceLog from './screens/SpaceLog';
import PlaceDetail from './screens/PlaceDetail';
import WriteReview from './screens/WriteReview';
import FriendLogDetail from './screens/FriendLogDetail';
import LinkAnalyzing from './screens/LinkAnalyzing';
import PlaceSelect from './screens/PlaceSelect';
import SearchPlaceMap from './screens/SearchPlaceMap';
import ShareImport from './screens/ShareImport';

const SCREENS = {
  splash: Splash,
  login: Login,
  signup: Signup,
  spaces: Spaces,
  createSpace: CreateSpace,
  spaceList: SpaceDetailList,
  spaceMap: SpaceDetailMap,
  spaceLog: SpaceLog,
  placeDetail: PlaceDetail,
  writeReview: WriteReview,
  friendLog: FriendLogDetail,
  linkAnalyzing: LinkAnalyzing,
  placeSelect: PlaceSelect,
  searchPlaceMap: SearchPlaceMap,
  shareImport: ShareImport,
};

function Toast() {
  const { toast } = useNav();
  if (!toast) return null;
  return (
    <div style={{ position: 'absolute', bottom: 110, left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: 'rgba(28,28,32,.96)', backdropFilter: 'blur(10px)', borderRadius: 14, padding: '12px 18px', font: '700 13px/1.3 system-ui', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,.5)', maxWidth: '80%', textAlign: 'center', animation: 'pmPop .25s ease' }}>
      {toast}
    </div>
  );
}

function Router() {
  const { current, anim } = useNav();
  const Screen = SCREENS[current.name] || Splash;
  return (
    <>
      <div key={current.name + JSON.stringify(current.params)} className={`pm-screen ${anim}`}>
        <Screen {...current.params} />
      </div>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <div className="pm-device">
      <NavProvider>
        <Router />
      </NavProvider>
    </div>
  );
}
