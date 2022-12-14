import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';
const GithubContext = createContext();

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
    const initialState = {
        users: [],
        user: {},
        loading: false,
    };

    const [state, dispatch] = useReducer(githubReducer, initialState);

    //* Get search results
    const searchUsers = async (text) => {
        setLoading();

        const params = new URLSearchParams({
            q: text,
        });

        const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                // Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const { items } = await res.json();

        dispatch({
            type: 'GET_USERS',
            payload: items,
        });
    };

    //* Get single user
    const getUser = async (login) => {
        setLoading();

        const res = await fetch(`${GITHUB_URL}/users/${login}`, {
            headers: {
                // Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (res.statusCode === 404) {
            window.location = '/notfound';
        } else {
            const data = await res.json();

            dispatch({
                type: 'GET_USER',
                payload: data,
            });
        }
    };

    //* Clear users from state
    const clearUsers = () =>
        dispatch({
            type: 'CLEAR_USERS',
        });

    //* Set loading
    const setLoading = () =>
        dispatch({
            type: 'SET_LOADING',
        });

    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                user: state.user,
                loading: state.loading,
                searchUsers,
                clearUsers,
                getUser,
            }}
        >
            {children}
        </GithubContext.Provider>
    );
};

export default GithubContext;
