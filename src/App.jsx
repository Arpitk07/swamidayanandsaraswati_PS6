import { useEmergencyStore } from './store/useEmergencyStore';
import { Landing } from './pages/Landing';
import { CitizenView } from './pages/CitizenView';
import { MechanicView } from './pages/MechanicView';

function App() {
    const { role } = useEmergencyStore();

    // Route based on selected role
    if (!role) {
        return <Landing />;
    }

    if (role === 'citizen') {
        return <CitizenView />;
    }

    if (role === 'mechanic') {
        return <MechanicView />;
    }

    return <Landing />;
}

export default App;
