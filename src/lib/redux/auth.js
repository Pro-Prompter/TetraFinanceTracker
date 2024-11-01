import { Client, Account, ID } from "appwrite";

export class Auth {
    client = new Client();
    account;

    constructor() {
        this.client = new Client()
            .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
            .setProject("66adcdf60024b7054a30"); // Your Appwrite project ID
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return await this.login({ email, password }); // Log in the user
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            return null; // Return null if the user is not authenticated
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession("current");
        } catch (error) {
            throw error;
        }
    }
}

const auth = new Auth();
export default auth;