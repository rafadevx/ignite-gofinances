import React from 'react';
import { Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  ButtonWrapper,
 } from './styles';

export function SignIn() {
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert("Não foi possível autenticar.")
    }
  }

  async function handleSignInWithApple() {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert("Não foi possível autenticar.")
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples 
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <ButtonWrapper>
          <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInWithGoogle} />
          {Platform.OS === 'ios' && <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} onPress={handleSignInWithApple} />}
        </ButtonWrapper>
      </Footer>
    </Container>
  )
}