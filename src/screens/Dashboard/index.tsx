import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import { useAuth } from "../../hooks/auth";
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer,
 } from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  total: string;
  lastTransactionDate: string;
}

interface HighLightData {
  entries: HighLightProps;
  expenses: HighLightProps;
  balance: HighLightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highLightData, setHighLighData] = useState<HighLightData>({} as HighLightData);
  
  const theme = useTheme();
  const { user, signOut } = useAuth();
  
  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
    let date = '';
    if (collection.length > 0) {
      const lastDate = Math.max.apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime()));
      if (lastDate !== -Infinity) {
        date = Intl.DateTimeFormat('pt-BR', {
          day: 'numeric',
          month: 'long',
        }).format(new Date(lastDate));
      }
    }
    
    return date;
  }

  async function loadTransactions() {
    let entriesTotal = 0;
    let expensesTotal = 0;
    const transactions = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
    const transactionsList = transactions ? JSON.parse(transactions) : [];
    const formattedTransactionsList: DataListProps[] = transactionsList
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensesTotal += Number(item.amount)
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));
        
        return {
          id: item.id,
          name: item.name,
          amount,
          date,
          type: item.type,
          category: item.category
        }
      });

    
    setData(formattedTransactionsList);
    setHighLighData({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactionDate: `Última entrada dia ${getLastTransactionDate(transactionsList, 'positive')}`
      },
      expenses: {
        total: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactionDate: `Última saída dia ${getLastTransactionDate(transactionsList, 'negative')}`
      },
      balance: {
        total: (entriesTotal - expensesTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactionDate: '01 a 16 de abril'
      }
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      { 
        isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
        :
      <>
      <Header>
        <UserWrapper>
        <UserInfo>
          <Photo source={{ uri: user.photo }}/>
          <User>
            <UserGreeting>Olá,</UserGreeting>
            <UserName>{user.name}</UserName>
          </User>
        </UserInfo>
        <LogoutButton onPress={signOut}>
          <Icon name="power" />
        </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard type="up" title="Entradas" amount={highLightData.entries.total} lasTransaction={highLightData.entries.lastTransactionDate} />
        <HighlightCard type="down" title="Saídas" amount={highLightData.expenses.total} lasTransaction={highLightData.expenses.lastTransactionDate}/>
        <HighlightCard type="total" title="Total" amount={highLightData.balance.total} lasTransaction={highLightData.balance.lastTransactionDate}/>
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
        
      </Transactions>
      </>
      }
    </Container>
  )
}
