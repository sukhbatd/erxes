import React from 'react';
import { useQuery, gql } from '@apollo/client';
import queries from '../graphql/queries';
import ListNew from '../components/ListNew';

const ListContainer = () => {
  const { data, loading } = useQuery(gql(queries.list));

  return <ListNew dealmaps={data?.dealmaps || []} loading={loading} />;
};

export default ListContainer;
