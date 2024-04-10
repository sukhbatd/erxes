import React, { useState } from 'react';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import { IFormProps } from '@erxes/ui/src/types';

import { ModalFooter } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';

interface IOption {
  _id: string;
  name: string;
}

interface FormProps {
  closeModal?: () => void;
  boards: IOption[];
  pipelines: IOption[];
  stages: IOption[];
  loading: boolean;
  ploading: boolean;
  sloading: boolean;
  getPipelines: any;
  getStages: any;
  addDealmap: any;
  loadingAction: boolean;
}

export const FormNew = ({
  closeModal,
  boards,
  pipelines,
  stages,
  loading,
  ploading,
  sloading,
  getPipelines,
  getStages,
  loadingAction,
  addDealmap
}: FormProps) => {
  const [boardId, setBoardId] = useState('');
  const [pipelineId, setPipelineId] = useState('');
  const initialStageIds = {
    freeStageId: '',
    pendingStageId: '',
    confirmedStageId: ''
  };
  const [stageIds, setStageIds] = useState(initialStageIds);

  const handleBoardChange = (e: any) => {
    setBoardId(e?.target?.value);
    setPipelineId('');
    setStageIds(initialStageIds);
    getPipelines({
      variables: {
        boardId: e?.target?.value,
        isAll: true
      }
    });
  };

  const handlePipelineChange = (e: any) => {
    setPipelineId(e?.target?.value);
    setStageIds(initialStageIds);
    getStages({
      variables: {
        pipelineId: e?.target?.value,
        isAll: true
      }
    });
  };

  const handleChooseStage = (e, stage: string) => {
    setStageIds({ ...stageIds, [stage]: e?.target?.value });
  };

  const addEmptyOption = options => {
    (options || []).unshift({ value: undefined, label: '' });
    return options;
  };

  return (
    <Form
      onSubmit={values => addDealmap({ variables: values })}
      renderContent={(formProps: IFormProps) => {
        return (
          <>
            <FormGroup>
              <ControlLabel required={true}>name</ControlLabel>
              <FormControl
                {...formProps}
                name="name"
                type="text"
                required={true}
                autoFocus={true}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel required={true}>Choose Board</ControlLabel>
              <FormControl
                // {...formProps}
                name="boardId"
                componentClass="select"
                onChange={handleBoardChange}
                value={boardId}
                options={addEmptyOption(
                  boards.map(board => ({
                    value: board?._id,
                    label: board?.name
                  }))
                )}
              />
            </FormGroup>
            {!!boardId && (
              <FormGroup>
                <ControlLabel required={true}>Choose pipeline</ControlLabel>
                <FormControl
                  {...formProps}
                  name="boardId"
                  componentClass="select"
                  disabled={loading || ploading}
                  options={addEmptyOption(
                    pipelines.map(pipeline => ({
                      value: pipeline?._id,
                      label: pipeline?.name
                    }))
                  )}
                  value={pipelineId}
                  onChange={handlePipelineChange}
                />
              </FormGroup>
            )}

            {!!pipelineId && (
              <FormGroup>
                <ControlLabel required={true}>Choose free stage</ControlLabel>
                <FormControl
                  {...formProps}
                  name="freeStageId"
                  componentClass="select"
                  disabled={sloading}
                  options={addEmptyOption(
                    stages.map(stage => ({
                      value: stage?._id,
                      label: stage?.name
                    }))
                  )}
                  value={stageIds.freeStageId}
                  onChange={e => handleChooseStage(e, 'freeStageId')}
                />
              </FormGroup>
            )}
            {!!stageIds.freeStageId && (
              <FormGroup>
                <ControlLabel required={true}>
                  Choose pending stage
                </ControlLabel>
                <FormControl
                  {...formProps}
                  name="pendingStageId"
                  componentClass="select"
                  disabled={sloading}
                  options={addEmptyOption(
                    stages.map(stage => ({
                      value: stage?._id,
                      label: stage?.name
                    }))
                  )}
                  value={stageIds.pendingStageId}
                  onChange={e => handleChooseStage(e, 'pendingStageId')}
                />
              </FormGroup>
            )}
            {!!stageIds.pendingStageId && (
              <FormGroup>
                <ControlLabel required={true}>
                  Choose confirmed stage
                </ControlLabel>
                <FormControl
                  {...formProps}
                  name="confirmedStageId"
                  componentClass="select"
                  disabled={sloading}
                  options={addEmptyOption(
                    stages.map(stage => ({
                      value: stage?._id,
                      label: stage?.name
                    }))
                  )}
                  value={stageIds.confirmedStageId}
                  onChange={e => handleChooseStage(e, 'confirmedStageId')}
                />
              </FormGroup>
            )}
            <ModalFooter id={'AddTagButtons'}>
              <Button
                btnStyle="simple"
                onClick={closeModal}
                icon="times-circle"
                type="button"
              >
                Cancel
              </Button>
              <Button
                btnStyle="success"
                icon="check-circle"
                type="submit"
                disabled={loadingAction}
              >
                Add Dealmap
              </Button>
            </ModalFooter>
          </>
        );
      }}
    />
  );
};
