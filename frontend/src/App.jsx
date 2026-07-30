import { HromadyProvider } from "./context/HromadyContext.jsx";
import Header from "./components/Header.jsx";
import MapView from "./components/MapView.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  return (
    <HromadyProvider>
      <Header />
      <div className="app">
        <MapView />
        <Sidebar />
      </div>
      <Toast />
    </HromadyProvider>
  );
}
