import React from 'react';

import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

describe('Profil Screen', () => {

  it('check if text input placeholder is correctly', () => {
    const { getByPlaceholderText } = render(<Profile />);
    
    const inputName =getByPlaceholderText('Nome');

    expect(inputName).toBeTruthy();
  });

  it('check load user data', () => {
    const { getByTestId } = render(<Profile />);

    const inputName = getByTestId('input-name');
    const inputSurname = getByTestId('input-surname');

    expect(inputName.props.value).toEqual('Rafael');
    expect(inputSurname.props.value).toEqual('Del Grossi');
  });

  it('check render title', () => {
    const { getByTestId } = render(<Profile />);

    const textTitle = getByTestId('text-title');

    expect(textTitle.props.children).toContain('Profile');
  });
});