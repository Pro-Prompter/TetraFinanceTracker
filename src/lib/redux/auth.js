import { Client, Account, ID } from "appwrite";

export class Auth {
    client = new Client();
    account;

  constructor() {
    this.client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("66adcdf60024b7054a30");
    this.account = new Account(this.client);
  }

  async createAccount({email ,password , name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email , password , name);

            if(userAccount){
                return this.login({email , password});
            } else {
                return userAccount;
            }
        } catch (error ) {
            throw error;
            
        }
    }

    async login({email , password}) {
        try {
            return await this.account.createEmailPasswordSession(email , password);
        } catch (error) {
            console.log(error)
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log(error)
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession("current");
        } catch (error) {
        }
    }
}

const auth = new Auth();
export default auth;
