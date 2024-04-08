// import Button from '@erxes/ui/src/components/Button';
// import { IDealmap, IType } from '../types';
// import Row from './Row';
// import { IButtonMutateProps } from '@erxes/ui/src/types';
// import { __ } from '@erxes/ui/src/utils';
// import React from 'react';
// import Form from './Form';
// import { Title } from '@erxes/ui-settings/src/styles';
// import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
// import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
// import Table from '@erxes/ui/src/components/table';
// import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
// import asyncComponent from '@erxes/ui/src/components/AsyncComponent';

// type Props = {
//   dealmaps: IDealmap[];
//   types: IType[];
//   typeId?: string;
//   renderButton: (props: IButtonMutateProps) => JSX.Element;
//   remove: (dealmap: IDealmap) => void;
//   edit: (dealmap: IDealmap) => void;
//   loading: boolean;
// };

// function List({
//   dealmaps,
//   typeId,
//   types,
//   remove,
//   renderButton,
//   loading,
//   edit
// }: Props) {
//   const trigger = (
//     <Button id={'AddDealmapButton'} btnStyle="success" icon="plus-circle">
//       Add Dealmap
//     </Button>
//   );

//   const modalContent = props => (
//     <Form
//       {...props}
//       types={types}
//       renderButton={renderButton}
//       dealmaps={dealmaps}
//     />
//   );

//   const actionBarRight = (
//     <ModalTrigger
//       title={__('Add dealmap')}
//       trigger={trigger}
//       content={modalContent}
//       enforceFocus={false}
//     />
//   );

//   const title = <Title capitalize={true}>{__('Dealmap')}</Title>;

//   const actionBar = (
//     <Wrapper.ActionBar left={title} right={actionBarRight} wideSpacing />
//   );

//   const content = (
//     <Table>
//       <thead>
//         <tr>
//           <th>{__('Todo')}</th>
//           <th>{__('Expiry Date')}</th>
//           <th>{__('Actions')}</th>
//         </tr>
//       </thead>
//       <tbody id={'DealmapsShowing'}>
//         {dealmaps.map(dealmap => {
//           return (
//             <Row
//               space={0}
//               key={dealmap._id}
//               dealmap={dealmap}
//               remove={remove}
//               edit={edit}
//               renderButton={renderButton}
//               dealmaps={dealmaps}
//               types={types}
//             />
//           );
//         })}
//       </tbody>
//     </Table>
//   );

//   const SideBarList = asyncComponent(
//     () =>
//       import(
//         /* webpackChunkName: "List - Dealmaps" */ '../containers/SideBarList'
//       )
//   );

//   const breadcrumb = [
//     { title: __('Settings'), link: '/settings' },
//     { title: __('Dealmaps'), link: '/dealmaps' }
//   ];

//   return (
//     <div>
//       <Wrapper
//         header={
//           <Wrapper.Header title={__('Dealmaps')} breadcrumb={breadcrumb} />
//         }
//         actionBar={actionBar}
//         content={
//           <DataWithLoader
//             data={content}
//             loading={loading}
//             count={dealmaps.length}
//             emptyText={__('Theres no dealmap')}
//             emptyImage="/images/actions/8.svg"
//           />
//         }
//         leftSidebar={<SideBarList currentTypeId={typeId} />}
//         transparent={true}
//         hasBorder
//       />
//     </div>
//   );
// }

// export default List;
