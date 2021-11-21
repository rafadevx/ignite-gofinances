import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';


export function Profile() {
  return (
    <View>
      <Text>Profile</Text>

      <TextInput placeholder="Nome" autoCapitalize="none" />
      <TextInput placeholder="Sobrenome" />

      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
}