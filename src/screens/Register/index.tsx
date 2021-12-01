import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number().typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo').required('Valor é obrigatório')
}).required();

export function Register() {
  const [trasactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'categoria',
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema)});

  // const navigation = useNavigation();

  const { user } = useAuth();

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!trasactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if (category.key === 'category') {
      return Alert.alert("Selecione a categoria");
    }

    const data = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: trasactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const transactions = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
      const transactionsList = transactions ? JSON.parse(transactions) : [];
      await AsyncStorage.setItem(`@gofinances:transactions_user:${user.id}`, JSON.stringify([...transactionsList, data]));
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'categoria',
      });
      
      // navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                title="Income"
                type="up"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={trasactionType === 'positive'}
              />
              <TransactionTypeButton
                title="Outcome"
                type="down"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={trasactionType === 'negative'}
              />
            </TransactionTypes>
            <CategorySelectButton
              testID="button-category" 
              title={category.name} 
              onPress={handleOpenSelectCategory} 
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal testID="modal-category" visible={categoryModalOpen}>
          <CategorySelect 
            category={category} 
            setCategory={setCategory} 
            closeSelectCategory={handleCloseSelectCategory} 
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}