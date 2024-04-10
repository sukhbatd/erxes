import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils';
import ListContainer from '../containers/List';
import { Title } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import FormContainer from '../containers/Form';

const breadcrumb = [
  { title: __('Settings'), link: '/settings' },
  { title: __('Dealmaps'), link: '/dealmaps' }
];

// const FormNew = asyncComponent(
//   () => import(/* webpackChunkName: "List - Dealmaps" */ './FormNew')
// );

const ListPage = () => {
  return (
    <Wrapper
      header={<Wrapper.Header title={__('Dealmaps')} breadcrumb={breadcrumb} />}
      actionBar={
        <Wrapper.ActionBar
          wideSpacing
          left={<Title capitalize={true}>{__('Dealmap')}</Title>}
          right={
            <ModalTrigger
              title={__('Add dealmap')}
              trigger={
                <Button
                  id={'AddDealmapButton'}
                  btnStyle="success"
                  icon="plus-circle"
                >
                  Add Dealmap
                </Button>
              }
              content={props => <FormContainer {...props} />}
              enforceFocus={false}
            />
          }
        />
      }
      content={<ListContainer />}
      transparent={true}
      hasBorder
    />
  );
};

export default ListPage;
