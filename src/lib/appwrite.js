import { Client, Account, Databases, ID, Storage, Query  } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite endpoint
  .setProject("66adcdf60024b7054a30"); // project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);


export { account, client, databases, ID, storage, Query };