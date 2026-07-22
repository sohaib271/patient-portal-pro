import {api} from './api';

export class AuthService {
    static async login(email: string, password: string) {
        var phone='';
        if(!email.includes('@')) phone=email;
        const res = await api.post('/auth/login', { email,phone, password });
        return res.data;
    }
}