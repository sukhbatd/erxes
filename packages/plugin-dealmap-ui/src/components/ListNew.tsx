import React, { type FC } from 'react';
import { IDealmap } from '../types';
import { __ } from '@erxes/ui/src/utils';
import { DataWithLoader, Table } from '@erxes/ui/src/components';

interface ListNewProps {
  dealmaps: IDealmap[];
  loading: boolean;
}

const ListNew: FC<ListNewProps> = ({ dealmaps, loading }) => {
  return (
    <DataWithLoader
      data={
        <Table>
          <thead>
            <tr>
              <th>{__('Name')}</th>
              <th>{__('Expiry Date')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody id={'DealmapsShowing'}>
            {dealmaps.map(dealmap => {
              return <div>hi</div>;
            })}
          </tbody>
        </Table>
      }
      loading={loading}
      count={dealmaps.length}
      emptyText={__('Theres no dealmap')}
      emptyImage="/images/actions/8.svg"
    />
  );
};
export default ListNew;
