import api from './axiosConfig'; // Import the configured Axios instance

const handleResponse = (response) => {
    if (!response || typeof response !== 'object') {
        throw new Error("Invalid response from server.");
    }

    if (response.status >= 200 && response.status < 300) {
        if (response.data === null || response.data === undefined) {
            throw new Error("Empty response data.");
        }
        return response.data;
    }

    // For non-2xx responses
    throw new Error(response.statusText || `Request failed with status ${response.status}`);
};

const getAuthHeader = () => {
    const user = localStorage.getItem('user');
    if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.token) {
            return { Authorization: `Bearer ${parsedUser.token}` };
        } else {
            console.warn("Token is missing in user object.");
        }
    } else {
        console.warn("No user found in localStorage.");
    }
    return {};
};

// Generic API request functions
const get = (url, params = {}) =>
    api.get(url, { params, headers: getAuthHeader() }).then(handleResponse);

const post = (url, data = {}) =>
    api.post(url, data, { headers: getAuthHeader() }).then(handleResponse);

const put = (url, data = {}) =>
    api.put(url, data, { headers: getAuthHeader() }).then(handleResponse);

const del = (url) =>
    api.delete(url, { headers: getAuthHeader() }).then(handleResponse);

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
    searchBooks: (params) => get('/books/search', params),
};

const memberApi = {
    getMembers: () => get('/members'),
    getMember: (id) => get(`/members/${id}`),
    getMemberProfile: () => get('/members/me'),
    createMember: (memberData) => post('/members', memberData),
    updateMember: (id, memberData) => put(`/members/${id}`, memberData),
    deleteMember: (id) => del(`/members/${id}`),
};

const loanApi = {
    getLoans: () => get('/loans'),
    getLoan: (id) => get(`/loans/${id}`),
    createLoan: (loanData) => post('/loans/borrow', loanData),
    returnLoan: (loanId) => put(`/loans/return/${loanId}`),
    deleteLoan: (id) => del(`/loans/${id}`),
    getLoansByMemberId: (memberId) => get(`/loans/member/${memberId}`),
    getOverdueLoans: () => get('/loans/overdue'),
    borrowBook: (bookId, memberId) => post('/loans/borrow', { bookId, memberId }),
};
export { authApi, bookApi, memberApi, loanApi };
