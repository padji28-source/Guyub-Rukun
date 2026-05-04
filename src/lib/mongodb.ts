import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000
};
const client = new MongoClient(process.env.mongodb+srv://Vercel-Admin-guyubrukun:9g2hBGObfwk7jsC5@guyubrukun.p44ypuj.mongodb.net/?retryWrites=true&w=majority, options);
   
// Attach the client to ensure proper cleanup on function suspension
attachDatabasePool(client);

// Export a module-scoped MongoClient to ensure the client can be shared across functions.
export default client; 
