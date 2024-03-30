import TickettrClient from "./lib/Client";
import dotenv from 'dotenv';
import {PrismaClient} from '@prisma/client'
dotenv.config()
const client = new TickettrClient();

export const prisma = new PrismaClient()
client.run();