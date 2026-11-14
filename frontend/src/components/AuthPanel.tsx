import { useState, type FormEvent } from "react";
import styled from "styled-components";
import { login, register, type User } from "../api/auth";
import { ApiError } from "../api/client";
import {
  Button,
  ErrorText,
  Input,
  LinkButton,
  Muted,
  Panel,
  PanelTitle,
} from "./ui";

type Mode = "login" | "register";

type AuthPanelProps = {
  onAuth: (user: User) => void;
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function AuthPanel({ onAuth }: AuthPanelProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const action = isLogin ? login : register;
      onAuth(await action({ username: username.trim(), password }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isLogin ? "register" : "login");
    setError(null);
  }

  return (
    <Panel>
      <PanelTitle>{isLogin ? "Вход" : "Регистрация"}</PanelTitle>
      <Muted>Войдите, чтобы ваши результаты попали в таблицу лидеров.</Muted>

      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Имя"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Пароль"
          autoComplete={isLogin ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" disabled={loading}>
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </Button>
      </Form>

      <LinkButton type="button" onClick={switchMode}>
        {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
      </LinkButton>
    </Panel>
  );
}
