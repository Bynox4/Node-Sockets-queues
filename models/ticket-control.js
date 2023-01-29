import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import json from '../db/data.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Ticket {
    constructor( number, desk ){
        this.number = number;
        this.desk = desk;
    }
}


class TicketControl {

    constructor(){
        this.last = 0;
        this.today = new Date().getDate(); //26
        this.tickets = [];
        this.last4 = [];

        this.init();
    }

    get toJson(){
        return{
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            last4: this.last4,
        }
    }

    init(){
        const { today, tickets, last4, last} = json;
        if ( today === this.today ){
            this.tickets = tickets;
            this.last = last;
            this.last4 = last4;
        } else {
            // Otro dia
            this.saveDB();
        }
    }

    saveDB(){
        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) )
    }

    next(){
        this.last += 1;
        const ticket = new Ticket( this.last, null );
        this.tickets.push( ticket );

        this.saveDB();
        return 'Ticket ' + ticket.number;
    }

    attendTicket( desk ){

        // No tenemos tickets
        if( this.tickets.length === 0 ){
            return null;
        }

        const ticket = this.tickets.shift(); // this.tickets[0]

        ticket.desk = desk;

        this.last4.unshift( ticket );

        if ( this.last4.length > 4 ){
            this.last4.splice(-1, 1)
        }

        this.saveDB();

        return ticket;
    }

}

export default TicketControl;