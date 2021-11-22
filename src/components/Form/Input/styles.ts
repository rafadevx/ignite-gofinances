import styled, { css } from "styled-components/native";
import { TextInput } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface ContainerProps {
  active?: boolean;
}

export const Container = styled(TextInput)<ContainerProps>`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.shape};
  color: ${({ theme }) => theme.colors.title};
  height: ${RFValue(56)}px;
  width: 100%;
  padding: 16px 18px;
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-bottom: 8px;

  ${({ active, theme}) => active && css`
    border-width: 3px;
    border-color: ${theme.colors.attention};
  `}
`;