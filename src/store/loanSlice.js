import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const fetchMemberLoans = createAsyncThunk(
  'loan/fetchMemberLoans',
  async (memberId) => {
    const response = await axios.get(`${BASE_URL}/member/${memberId}`);
    return response.data;
  }
);

export const returnBook = createAsyncThunk(
  'loan/returnBook',
  async (loanId) => {
    const response = await axios.put(`${BASE_URL}/loans/return/${loanId}`);
    return response.data;
  }
);

export const payFine = createAsyncThunk(
  'loan/payFine',
  async (loanId) => {
    const response = await axios.put(`${BASE_URL}/loans/payFine/${loanId}`);
    return response.data;
  }
);

const loanSlice = createSlice({
  name: 'loan',
  initialState: {
    loans: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
      })
      .addCase(fetchMemberLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        const index = state.loans.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      })
      .addCase(payFine.fulfilled, (state, action) => {
        const index = state.loans.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      });
  },
});

export default loanSlice.reducer;
