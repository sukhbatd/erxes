import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './Form';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IDealmap, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { FormControl } from '@erxes/ui/src/components/form';
import { colors, dimensions } from '@erxes/ui/src/styles';

const DealmapNameStyled = styledTS<{ checked: boolean }>(styled.div).attrs({})`
    color: ${colors.colorCoreBlack};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')}
    `;

export const DealmapWrapper = styledTS<{ space: number }>(
  styled.div
)`padding-left: ${props => props.space * 20}px;
  display:inline-flex;
  justify-content:flex-start;
  align-items: center;
`;

const Margin = styledTS(styled.div)`
 margin: ${dimensions.unitSpacing}px;
`;

type Props = {
  dealmap: IDealmap;
  space: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  dealmaps: IDealmap[];
  remove: (dealmap: IDealmap) => void;
  edit: (dealmap: IDealmap) => void;
  types?: IType[];
};

type State = {
  checked: boolean;
};

class Row extends React.Component<Props, State> {
  Dealmaps({ dealmap, checked }) {
    return <DealmapNameStyled checked={checked}>{dealmap.name}</DealmapNameStyled>;
  }

  removeDealmap = () => {
    const { remove, dealmap } = this.props;

    remove(dealmap);
  };

  toggleCheck = () => {
    const { edit, dealmap } = this.props;

    edit({ _id: dealmap._id, checked: !dealmap.checked });
  };

  render() {
    const { dealmap, renderButton, space, dealmaps, types } = this.props;

    const editTrigger = (
      <Button btnStyle='link'>
        <Tip text={__('Edit')} placement='top'>
          <Icon icon='edit-3'></Icon>
        </Tip>
      </Button>
    );

    const content = props => (
      <Form
        {...props}
        types={types}
        dealmap={dealmap}
        renderButton={renderButton}
        dealmaps={dealmaps}
      />
    );

    const extractDate = dealmap.expiryDate
      ? dealmap.expiryDate?.toString().split('T')[0]
      : '-';

    return (
      <tr>
        <td>
          <DealmapWrapper space={space}>
            <FormControl
              componentClass='checkbox'
              onChange={this.toggleCheck}
              color={colors.colorPrimary}
              defaultChecked={dealmap.checked || false}
            ></FormControl>
            <Margin>
              <this.Dealmaps dealmap={dealmap} checked={dealmap.checked || false} />
            </Margin>
          </DealmapWrapper>
        </td>
        <td>{extractDate}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              title='Edit dealmap'
              trigger={editTrigger}
              content={content}
            />

            <Tip text={__('Delete')} placement='top'>
              <Button
                btnStyle='link'
                onClick={this.removeDealmap}
                icon='times-circle'
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
