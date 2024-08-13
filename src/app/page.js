import VotingSystem from '../components/VotingSystem';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div style={{ backgroundImage: 'url(/voting_portal/astronomy-background.jfif)', backgroundSize: 'cover', minHeight: '100vh' }}>
      <Navbar />
      <VotingSystem />
    </div>
  );
}
