import { Client, Account, ID } from 'appwrite';

export class Auth {
    constructor() {
        this.client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject('66adcdf60024b7054a30');
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            await this.account.create(ID.unique(), email, password, name);
            return this.login({ email, password });
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession('current');
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const auth = new Auth();
export default auth;