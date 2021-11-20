import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled(RectButton).attrs({
  activeOpacity: 0.7
})`
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
  margin-top: 16px;
  padding: 18px 16px;
  justify-content: space-between;
  `;

export const Category = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
`;
