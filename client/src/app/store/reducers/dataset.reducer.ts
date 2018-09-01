import { ProjectsActionConstants } from '@app/store/actions/projects/projects.action-types';
import { Actions as projectActions } from '@app/store/actions/projects/projects.actions';
import { DatasetActionConstants as constants } from '@app/store/actions/datasets/datasets.action-types';
import { Actions as datasetsActions } from '@app/store/actions/datasets/datasets.actions';
import { DatasetState, Dataset } from '@app/models/dataset.model';
import { combineReducers } from '@ngrx/store';
import { NormalizedSchemeField } from '@app/models/normalizr.model';

export const initialState: DatasetState = {
	byId: {},
	isLoading: false
};

const byId = (
	state = initialState.byId,
	action: projectActions | datasetsActions
): NormalizedSchemeField<Dataset> => {
	switch (action.type) {
		case ProjectsActionConstants.LOAD_ONE_PROJECT__COMPLETE:
			return action.payload.entities.dataset;
		case constants.PARSE_DATA__COMPLETE:
			return {
				...state,
				...action.payload.entities.dataset
			};
		case constants.DELETE_COLUMN:
			return {
				...state,
				[action.payload.datasetId]: {
					...state[action.payload.datasetId],
					modified: {
						...state[action.payload.datasetId].modified,
						columns: [
							...state[action.payload.datasetId].modified.columns.filter(
								colId => colId !== action.payload.columnId
							)
						],
						data: [
							...state[action.payload.datasetId].modified.data.map(
								dataArr => dataArr.filter(
									(data: string) => !data.endsWith(`-${action.payload.columnId}-${action.payload.datasetId}`)
								)
							)
						]
					}
				}
			};
		case constants.DELETE_ROW:
			return {
				...state,
				[action.payload.datasetId]: {
					...state[action.payload.datasetId],
					modified: {
						...state[action.payload.datasetId].modified,
						data: [
							...state[action.payload.datasetId].modified.data.filter(
								dataArr => !dataArr.includes(action.payload.rowId)
							)
						]
					}
				}
			};
		case constants.ADD_NEW_COLUMN:
			return {
				...state,
				[action.payload.datasetId]: {
					...state[action.payload.datasetId],
					modified: {
						...state[action.payload.datasetId].modified,
						columns: [
							...state[action.payload.datasetId].modified.columns,
							action.payload.columnId
						],
						data: [
							...state[action.payload.datasetId].modified.data.map(
								(dataArr, i) => {
									dataArr.push(`${i}-${action.payload.columnId}-${action.payload.datasetId}`);
									return dataArr;
								}
							)
						]
					}
				}
			};
		case constants.ADD_NEW_ROW:
			return {
				...state,
				[action.payload.datasetId]: {
					...state[action.payload.datasetId],
					modified: {
						...state[action.payload.datasetId].modified,
						data: [
							...state[action.payload.datasetId].modified.data,
							action.payload.columnIds.map(colId =>
								`${action.payload.dataLength}-${colId}-${action.payload.datasetId}`
							)
						]
					}
				}
			};
		default:
			return state;
	}
};

const isLoading = (
	state = initialState.isLoading,
	action: projectActions | datasetsActions
) => {
	switch (action.type) {
		case constants.PARSE_FROM_FILE:
		case constants.PARSE_FROM_URL:
		case constants.PARSE_PLAIN_TEXT:
			return true;
		case constants.PARSE_DATA__COMPLETE:
		case constants.PARSE_DATA__FAILED:
			return false;
		default:
			return state;
	}
};

export const datasetReducer = combineReducers({
	byId,
	isLoading
});
