import React from 'react';
import { useLazyQuery, gql, useQuery, useMutation } from '@apollo/client';
import queries from '../graphql/queries';
import { FormNew } from '../components/FormNew';
import mutations from '../graphql/mutations';

interface FormContainerProps {}

const FormContainer: React.FC<FormContainerProps> = props => {
  const { data, loading } = useQuery(gql(queries.boards), {
    variables: {
      type: 'deal'
    }
  });
  const [getPipelines, { data: pdata, loading: ploading }] = useLazyQuery(
    gql(queries.pipelines)
  );
  const [getStages, { data: sdata, loading: sloading }] = useLazyQuery(
    gql(queries.stages)
  );

  const [addDealmap, { loading: loadingAction }] = useMutation(
    gql(mutations.add)
  );

  const boards = data?.boards || [];
  const pipelines = pdata?.pipelines || [];
  const stages = sdata?.stages || [];

  const updatedProps = {
    ...props,
    boards,
    pipelines,
    stages,
    loading,
    ploading,
    sloading,
    getPipelines,
    getStages,
    addDealmap,
    loadingAction
  };
  return <FormNew {...updatedProps} />;
};

export default FormContainer;
