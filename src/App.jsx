import { useEffect, useState } from "react";
import { BurgerMenu, Header, SearchOverlay } from "./components/shared/Header";
import { Footer } from "./components/shared/Footer";
import { Hero, NewsCard, Services } from "./components/home/Hero";
import { MapSection, Features } from "./components/home/Sections";
import {
  EvFleetLanding,
  EvFleetLogin,
  EvFleetRegister,
  ForgotPassword,
  ZBusinessLogin,
  ZBusinessRegister,
} from "./components/auth/LoginPages";
import { clearSession, getSession, headerDisplayName, updateAvatar } from "./auth";
import { FindStation } from "./components/find-station/FindStation";
import { StationDetails } from "./components/find-station/StationDetails";
import { PlanTrip } from "./components/plan-trip/PlanTrip";

const authPages = new Set([
  "ev-fleet",
  "ev-login",
  "ev-register",
  "ev-forgot",
  "z-business-login",
  "z-business-register",
  "z-business-forgot",
]);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [accountName, setAccountName] = useState(
    () => headerDisplayName(getSession()),
  );
  const [session, setSession] = useState(() => getSession());
  const [audience, setAudience] = useState(
    () => getSession()?.accountType || "personal",
  );
  const goHome = () => setPage("home");
  const goFindStation = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setPage("find-station");
  };
  const openStationDetails = (stationId) => {
    setSelectedStationId(stationId);
    setMenuOpen(false);
    setSearchOpen(false);
    setPage("station-details");
  };
  const goPlanTrip = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setPage("plan-trip");
  };
  const completeLogin = (nextSession) => {
    setSession(nextSession);
    setAccountName(headerDisplayName(nextSession));
    setAudience(nextSession.accountType || "personal");
    setPage("home");
  };
  const logout = () => {
    clearSession();
    setSession(null);
    setAccountName("");
  };
  const uploadAvatar = async (file) => {
    const result = await updateAvatar({
      email: session?.email,
      userId: session?.userId,
      file,
    });
    if (result.ok) setSession(result.session);
  };
  const goChargingLogin = () => {
    setSearchOpen(false);
    setMenuOpen(false);
    setPage("ev-fleet");
  };
  const goBusinessLogin = () => {
    setSearchOpen(false);
    setMenuOpen(false);
    setPage("z-business-login");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  if (authPages.has(page)) {
    return (
      <div className="min-h-screen bg-white">
        {page === "ev-fleet" ? (
          <EvFleetLanding
            onLogin={() => setPage("ev-login")}
            onHome={goHome}
          />
        ) : null}
        {page === "ev-login" ? (
          <EvFleetLogin
            accountType={audience}
            onHome={goHome}
            onForgot={() => setPage("ev-forgot")}
            onRegister={() => setPage("ev-register")}
            onSignedIn={completeLogin}
          />
        ) : null}
        {page === "ev-register" ? (
          <EvFleetRegister
            accountType={audience}
            onHome={goHome}
            onBack={() => setPage("ev-login")}
            onSignedIn={completeLogin}
          />
        ) : null}
        {page === "ev-forgot" ? (
          <ForgotPassword
            variant="ev"
            onHome={goHome}
            onBack={() => setPage("ev-login")}
          />
        ) : null}
        {page === "z-business-login" ? (
          <ZBusinessLogin
            accountType={audience}
            onHome={goHome}
            onRegister={() => setPage("z-business-register")}
            onForgot={() => setPage("z-business-forgot")}
            onSignedIn={completeLogin}
          />
        ) : null}
        {page === "z-business-register" ? (
          <ZBusinessRegister
            accountType={audience}
            onHome={goHome}
            onBack={() => setPage("z-business-login")}
            onSignedIn={completeLogin}
          />
        ) : null}
        {page === "z-business-forgot" ? (
          <ForgotPassword
            variant="business"
            onHome={goHome}
            onBack={() => setPage("z-business-login")}
          />
        ) : null}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#ececec] lg:bg-white">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-white lg:max-w-none">
        <Header
          onHome={goHome}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenSearch={() => setSearchOpen((open) => !open)}
          searchOpen={searchOpen}
          onFindStation={goFindStation}
          onPlanTrip={goPlanTrip}
          onOpenChargingLogin={goChargingLogin}
          onOpenBusinessLogin={goBusinessLogin}
          onLogout={logout}
          onUploadAvatar={uploadAvatar}
          accountName={accountName}
          accountAvatar={session?.avatarUrl}
          audience={audience}
          onAudienceChange={setAudience}
        />
        {page === "find-station" ? (
          <FindStation onBack={goHome} onSelectStation={openStationDetails} />
        ) : page === "station-details" ? (
          <StationDetails stationId={selectedStationId} onBack={goFindStation} />
        ) : page === "plan-trip" ? (
          <PlanTrip />
        ) : (
          <>
            <Hero onFindStation={goFindStation} />
            <NewsCard />
            <Services />
            <MapSection onFindStation={goFindStation} />
            <Features />
          </>
        )}
        <Footer />
        <BurgerMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onFindStation={goFindStation}
          onPlanTrip={goPlanTrip}
          onHome={goHome}
          onOpenChargingLogin={goChargingLogin}
          onOpenBusinessLogin={goBusinessLogin}
          onLogout={logout}
          onUploadAvatar={uploadAvatar}
          accountName={accountName}
          accountAvatar={session?.avatarUrl}
          audience={audience}
        />
        <SearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearchStations={goFindStation}
        />
      </div>
    </div>
  );
}

export default App;