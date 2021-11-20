import React from 'react';
import { categories } from '../../utils/categories';

import { 
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  Name,
  Date,
} from './styles';

interface CategoryProps {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({
  data
} : Props) {
  const [category] = categories.filter(
    item => item.key === data.category
  );
  return (
    <Container>
      <Title>{data.name}</Title>
      <Amount type={data.type}>{data.type === 'negative' ? '- ' + data.amount : data.amount}</Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <Name>{category.name}</Name>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  )
}