import TickettrClient from "./lib/Client";
import * as dotenv from 'dotenv';
dotenv.config()
export const client = new TickettrClient();

client.run();