import TickettrClient from "./lib/Client";
import dotenv from 'dotenv';
dotenv.config()
export const client = new TickettrClient();

client.run();