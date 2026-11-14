import styled from "styled-components";

// общие стили боковой панели — в тон игровому полю
export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background: #1f2b5c;
  color: #ffffff;
`;

export const PanelTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;

export const Muted = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
`;

export const ErrorText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: #ff8a8d;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #26336b;
  color: #ffffff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    border-color: #ffc93c;
  }
`;

export const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #ffc93c;
  color: #1f2b5c;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const LinkButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: #ffc93c;
  font-size: 14px;
  cursor: pointer;
`;
