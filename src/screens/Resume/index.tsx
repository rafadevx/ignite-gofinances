import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import { useFocusEffect } from "@react-navigation/native";

import { HistoryCard } from '../../components/HistoryCard';

import { 
  Container, 
  Header, 
  Title, 
  Content, 
  ChartContainer, 
  MonthSelect, 
  MonthSelectButton, 
  MonthSelectIcon, 
  Month,
  LoadContainer
} from './styles';
import { categories } from '../../utils/categories';
import { TransactionCardProps } from '../../components/TransactionCard';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/auth';

interface CategoryData {
  key: string;
  name: string;
  color: string;
  totalFormatted: string;
  total: number;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();

  const { user } = useAuth();

  function handleChangeDate(action: 'prev' | 'next') {
    setIsLoading(true);
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {

    const response = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
    const reponseFormatted = response ? JSON.parse(response) : [];

    const expenses = reponseFormatted.filter((expense: TransactionCardProps) => 
      expense.type === 'negative' &&
      new Date(expense.date).getMonth() === selectedDate.getMonth() &&
      new Date(expense.date).getFullYear() === selectedDate.getFullYear()
    );
    
    const expensesTotal = expenses.reduce((accumulator: number, expense: TransactionCardProps) => {
      return accumulator + Number(expense.amount);
    }, 0);
    
    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categoryTotal = 0;

      expenses.forEach((expense: TransactionCardProps) => {
        if(expense.category === category.key) {
          categoryTotal += Number(expense.amount);
        }
      });

      if (categoryTotal > 0) {
        const totalFormatted = categoryTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const percent = `${(categoryTotal / expensesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          totalFormatted,
          total: categoryTotal,
          percent
        });
      }
    });
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  },[selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

      { 
        isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
        :
        <Content contentContainerStyle={{ paddingHorizontal: 24 }}>
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeDate('next')}>
              <MonthSelectIcon name="chevron-right"/>
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories} 
              x="percent" 
              y="total" 
              colorScale={totalByCategories.map(category => category.color)} 
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={50}
            />
          </ChartContainer>
          {
            totalByCategories.map(category => (
              <HistoryCard key={category.key} title={category.name} amount={category.totalFormatted} color={category.color} />
            ))
          }
        </Content>
      }
    </Container>
  )
}