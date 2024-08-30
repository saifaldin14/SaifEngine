import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeTool: 'translate' | 'rotate' | 'scale'; // Can store the current tool like 'translate', 'rotate', etc.
  isSidebarOpen: boolean;    // Toggle the visibility of the sidebar
  isEditorOpen: boolean;     // Toggle the visibility of the model editor
  showGrid: boolean;       // Toggle the visibility of the grid
}

const initialState: UIState = {
  activeTool: 'translate',  // Default tool set to 'translate'
  isSidebarOpen: true,
  isEditorOpen: true,
  showGrid: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<'translate' | 'rotate' | 'scale'>) => {
      state.activeTool = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleEditor: (state) => {
      state.isEditorOpen = !state.isEditorOpen;
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
  },
});

export const { setActiveTool, toggleSidebar, toggleEditor, toggleGrid } = uiSlice.actions;
export default uiSlice.reducer;