import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { fetchMe, logout, type User } from "./api/auth";
import { ApiError, getToken } from "./api/client";
import { submitScore } from "./api/scores";
import AuthPanel from "./components/AuthPanel";
import GameCanvas from "./components/GameCanvas";
import Leaderboard from "./components/Leaderboard";
import UserPanel from "./components/UserPanel";
import { GlobalStyle } from "./globalStyle";

const Page = styled.main`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  min-height: 100vh;
  padding: 20px 16px;
  background: #141c3d;
`;

const GameArea = styled.div`
  flex: 1 1 480px;
  max-width: 800px;
`;

const Sidebar = styled.aside`
  display: flex;
  flex: 0 1 300px;
  flex-direction: column;
  gap: 20px;
  min-width: 260px;
`;

function App() {
  const [user, setUser] = useState<User | null>(null);
  // пока проверяем сохранённый токен, форму входа не показываем
  const [checkingSession, setCheckingSession] = useState(() => getToken() !== null);
  const [status, setStatus] = useState<string | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const refreshLeaderboard = () => setLeaderboardKey((key) => key + 1);

  useEffect(() => {
    if (!getToken()) return;
    fetchMe()
      .then(setUser)
      .catch((err) => {
        // токен протух или пользователя больше нет — просто разлогиниваем
        if (err instanceof ApiError && err.status === 401) logout();
      })
      .finally(() => setCheckingSession(false));
  }, []);

  function handleAuth(nextUser: User) {
    setUser(nextUser);
    setStatus(null);
    refreshLeaderboard();
  }

  function handleLogout() {
    logout();
    setUser(null);
    setStatus(null);
    refreshLeaderboard();
  }

  const handleGameOver = useCallback(
    async (score: number) => {
      if (!user || score === 0) return;
      try {
        const result = await submitScore(score);
        setUser((current) => current && { ...current, bestScore: result.bestScore });
        setStatus(result.isNewBest ? `Новый рекорд: ${score}!` : `Результат ${score} сохранён`);
        refreshLeaderboard();
      } catch (err) {
        setStatus(err instanceof Error ? err.message : "Не удалось сохранить результат");
      }
    },
    [user],
  );

  return (
    <>
      <GlobalStyle />
      <Page>
        <GameArea>
          <GameCanvas onGameOver={handleGameOver} />
        </GameArea>
        <Sidebar>
          {user && <UserPanel user={user} status={status} onLogout={handleLogout} />}
          {!user && !checkingSession && <AuthPanel onAuth={handleAuth} />}
          <Leaderboard refreshKey={leaderboardKey} currentUsername={user?.username ?? null} />
        </Sidebar>
      </Page>
    </>
  );
}

export default App;
