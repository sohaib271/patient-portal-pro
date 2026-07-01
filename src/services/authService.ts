import {api} from './api';

export class AuthService {
    static async login(email: string, password: string) {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    }
}