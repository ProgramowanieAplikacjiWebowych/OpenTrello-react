import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

  export default {
    user: {
        login: credentials =>
            instance.post("/login", credentials).then(res => {
                console.log(res);
                return res.data.user
            }).catch(err => {
                console.log('Login error', err.response);
                console.log('Login error', err.message);
                console.log('Login error', err.config);
                if (err.config && err.config.data) {
                    return err.config.data;
                } 
                return err;
            }),
        signup: user =>
            instance.post("/register", user).then(res => res.data.user),
        confirm: token =>
            instance
                .post("/api/auth/confirmation", { token })
                .then(res => res.data.user),
        resetPasswordRequest: email =>
            instance.post("/api/auth/reset_password_request", { email }),
        validateToken: token => instance.post("/api/auth/validate_token", { token }),
        resetPassword: data => instance.post("/api/auth/reset_password", { data })
    },
    board: {
      addBoard: board => 
        instance.post("/board", board).then(res => {
            console.log('add_board', res);
            return res
        }).catch(err => {
            console.log('add_board error', err);
            return err;
        })
    }
};
