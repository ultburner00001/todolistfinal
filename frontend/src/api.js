const API = process.env.REACT_APP_API_URL || 'https://todo-backend-9yyn.onrender.com';


export const authFetch = (path, token, opts = {}) => {
return fetch(API + path, {
...opts,
headers: {
'Content-Type': 'application/json',
...(opts.headers || {}),
...(token ? { Authorization: 'Bearer ' + token } : {})
}
}).then(r => r.json());
};


export default API;
