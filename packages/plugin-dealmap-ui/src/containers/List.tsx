import React from 'react';
import { useQuery, gql } from '@apollo/client';
import queries from '../graphql/queries';
import { Spinner } from '@erxes/ui/src/components';
import ListNew from '../components/ListNew';

const ListContainer = () => {
  const { data, loading } = useQuery(gql(queries.list));

  if (loading)
    return (
      <div>
        {' '}
        ddd
        <Spinner />
      </div>
    );

  const { dealmaps } = data;

  return <ListNew dealmaps={dealmaps} />;
};

export default ListContainer;
