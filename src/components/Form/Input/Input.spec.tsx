import React from 'react';

import { render } from '@testing-library/react-native';
import { Input } from '.';

import { ThemeProvider } from 'styled-components/native';
import theme from '../../../global/styles/theme';

const Provider: React.FC = ({ children }) => (
  <ThemeProvider theme={theme} >
    {children}
  </ThemeProvider>
)

describe('Input Component', () => {
  it('should have attention border color when active', () => {
    const { getByTestId } = render(
      <Input 
        testID="input-email"
        placeholder="E-mail"
        active={true}
      />,
      {
        wrapper: Provider
      }
    );

    const inputComponent = getByTestId('input-email');

    expect(inputComponent.props.style[0].borderColor).toEqual('#e83f5b');
  });
});