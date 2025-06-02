import api from './axiosConfig'; // Import the configured Axios instance

const handleResponse = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    // For non-2xx responses, throw an error with more details
    throw new Error(response.statusText || `Request failed with status ${response.status}`);
};

// Generic API request functions
const get = (url, params = {}) => api.get(url, { params }).then(handleResponse);
const post = (url, data = {}) => api.post(url, data).then(handleResponse);
const put = (url, data = {}) => api.put(url, data).then(handleResponse);
const del = (url) => api.delete(url).then(handleResponse);

// Library Management Specific API Calls
const authApi = {
    login: (credentials) => post('/auth/login', credentials),
    register: (userData) => post('/auth/register', userData),
};

const bookApi = {
    getBooks: () => get('/books'),
    getBook: (id) => get(`/books/${id}`),
    createBook: (bookData) => post('/books', bookData),
    updateBook: (id, bookData) => put(`/books/${id}`, bookData),
    deleteBook: (id) => del(`/books/${id}`),
    getAvailableBooks: () => get('/books/available'),
    searchBooks: (params) => get('/books/search', params) // Generic search
};

const memberApi = {
    getMembers: () => get('/members'),
    getMember: (id) => get(`/members/${id}`),
    getMemberProfile: () => get('/members/me'),
    createMember: (memberData) => post('/members', memberData),
    updateMember: (id, memberData) => put(`/members/${id}`, memberData),
    deleteMember: (id) => del(`/members/${id}`)
};

const loanApi = {
    getLoans: () => get('/loans'),
    getLoan: (id) => get(`/loans/${id}`),
    createLoan: (loanData) => post('/loans/borrow', loanData),
    returnLoan: (loanId) => put(`/loans/return/${loanId}`),
    deleteLoan: (id) => del(`/loans/${id}`),
    getLoansByMemberId: (memberId) => get(`/loans/member/${memberId}`), // Corrected URL
    getOverdueLoans: () => get('/loans/overdue'),
    borrowBook: (bookId, memberId) => post('/loans/borrow', { bookId, memberId })    
};

export { authApi, bookApi, memberApi, loanApi };