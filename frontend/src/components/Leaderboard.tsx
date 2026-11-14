import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchLeaderboard, type Leaderboard as LeaderboardData, type LeaderboardEntry } from "../api/scores";
import { ErrorText, Muted, Panel, PanelTitle } from "./ui";

type LeaderboardProps = {
  // меняется, когда таблицу нужно перезагрузить (вход, выход, новый результат)
  refreshKey: number;
  currentUsername: string | null;
};

const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Row = styled.li<{ $highlight: boolean }>`
  display: grid;
  grid-template-columns: 32px 1fr auto;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 15px;
  background: ${({ $highlight }) => ($highlight ? "rgba(255, 201, 60, 0.18)" : "#26336b")};
`;

const Rank = styled.span`
  color: rgba(255, 255, 255, 0.65);
`;

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Score = styled.span`
  font-weight: 700;
`;

function EntryRow({ entry, highlight }: { entry: LeaderboardEntry; highlight: boolean }) {
  return (
    <Row $highlight={highlight}>
      <Rank>{entry.rank}</Rank>
      <Name>{entry.username}</Name>
      <Score>{entry.score}</Score>
    </Row>
  );
}

export default function Leaderboard({ refreshKey, currentUsername }: LeaderboardProps) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const me = data?.me ?? null;
  const meInTop = me !== null && data !== null && data.entries.some((e) => e.rank === me.rank);

  return (
    <Panel>
      <PanelTitle>Таблица лидеров</PanelTitle>

      {error && <ErrorText>{error}</ErrorText>}
      {!error && data === null && <Muted>Загрузка…</Muted>}
      {data !== null && data.entries.length === 0 && <Muted>Пока никто не играл — будьте первым!</Muted>}

      {data !== null && data.entries.length > 0 && (
        <List>
          {data.entries.map((entry) => (
            <EntryRow key={entry.rank} entry={entry} highlight={entry.username === currentUsername} />
          ))}
        </List>
      )}

      {me !== null && !meInTop && (
        <>
          <Muted>Ваше место</Muted>
          <List>
            <EntryRow entry={me} highlight />
          </List>
        </>
      )}
    </Panel>
  );
}
