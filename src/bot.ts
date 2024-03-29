import TickettrClient from "./lib/Client";
import dotenv from 'dotenv';
dotenv.config()
const client = new TickettrClient();

 client.run();