import styled from "styled-components";
import type { User } from "../api/auth";
import { LinkButton, Muted, Panel } from "./ui";

type UserPanelProps = {
  user: User;
  status: string | null;
  onLogout: () => void;
};

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

const Name = styled.span`
  overflow: hidden;
  font-size: 20px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Status = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #ffc93c;
`;

export default function UserPanel({ user, status, onLogout }: UserPanelProps) {
  return (
    <Panel>
      <Header>
        <Name>{user.username}</Name>
        <LinkButton type="button" onClick={onLogout}>
          Выйти
        </LinkButton>
      </Header>
      <Muted>Лучший результат: {user.bestScore}</Muted>
      {status && <Status>{status}</Status>}
    </Panel>
  );
}
