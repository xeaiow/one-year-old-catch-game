import { useLocation } from 'react-router-dom';
import GuessGame from '@/components/guess/GuessGame';

interface LocationState {
  name?: string;
  avatarSeed?: string;
}

const Guess = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  return (
    <GuessGame
      playerName={state?.name || "Guest"}
      avatarSeed={state?.avatarSeed || "guest"}
    />
  );
};

export default Guess;
