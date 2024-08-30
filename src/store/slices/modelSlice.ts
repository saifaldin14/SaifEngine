import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Vector3Tuple = [number, number, number];

export interface ModelMetadata {
  id: string;
  type: string; // To indicate the type of geometry, e.g., 'box'
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
}

export interface ModelState {
  models: Array<ModelMetadata>;
  selectedModelId: string | null;
}

const initialState: ModelState = {
  models: [],
  selectedModelId: null,
};

const modelSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    addModel: (state, action: PayloadAction<ModelMetadata>) => {
      state.models.push(action.payload);
      state.selectedModelId = action.payload.id;
    },
    selectModel: (state, action: PayloadAction<string>) => {
      state.selectedModelId = action.payload;
    },
    updateModelTransform: (
      state,
      action: PayloadAction<{ id: string; position: Vector3Tuple; rotation: Vector3Tuple; scale: Vector3Tuple }>
    ) => {
      const model = state.models.find((m) => m.id === action.payload.id);
      if (model) {
        model.position = action.payload.position;
        model.rotation = action.payload.rotation;
        model.scale = action.payload.scale;
      }
    },
    createNewModel: (state, action: PayloadAction<{ type: string; position?: Vector3Tuple; rotation?: Vector3Tuple; scale?: Vector3Tuple }>) => {
      const newModel: ModelMetadata = {
        id: uuidv4(), // Generate a new unique ID
        type: action.payload.type,
        position: action.payload.position || [0, 0, 0],
        rotation: action.payload.rotation || [0, 0, 0],
        scale: action.payload.scale || [1, 1, 1],
      };
      state.models.push(newModel);
      state.selectedModelId = newModel.id;
    },
    removeModel: (state, action: PayloadAction<string>) => {
      state.models = state.models.filter((model) => model.id !== action.payload);
      if (state.selectedModelId === action.payload) {
        state.selectedModelId = null; // Deselect the model if it was selected
      }
    },
    duplicateModel: (state, action: PayloadAction<string>) => {
      const originalModel = state.models.find((model) => model.id === action.payload);
      if (originalModel) {
        const newModel: ModelMetadata = {
          ...originalModel,
          id: uuidv4(), // Assign a new unique ID for the duplicated model
        };
        state.models.push(newModel);
        state.selectedModelId = newModel.id; // Select the duplicated model
      }
    },
  },
});

export const { addModel, selectModel, updateModelTransform, createNewModel, removeModel, duplicateModel } = modelSlice.actions;
export default modelSlice.reducer;