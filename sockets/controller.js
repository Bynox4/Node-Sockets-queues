import TicketControl from "../models/ticket-control.js";

const ticketControl = new TicketControl;

export const socketController = ( socket ) => {

    // Cuando un cliente se conecta
    socket.emit('last-ticket', ticketControl.last );
    socket.emit('current-state', ticketControl.last4 );
    socket.emit('pending-tickets', ticketControl.tickets.length );

    socket.on('next-ticket', ( payload, callback ) => {
        const next = ticketControl.next();
        callback( next );

        // TODO: Notificar que hay un nuevo ticket pendiente que asignar
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length );
    });
    
    socket.on('attend-ticket', ({ desk }, callback) => {
        
        if( !desk ){
            return callback({
                ok: false,
                msg: 'desk es obligatorio'
            });
        }
        const ticket = ticketControl.attendTicket( desk );
        
        // TODO: Notificar cambio en los ultimos 4
        socket.broadcast.emit('current-state', ticketControl.last4 );
        socket.emit('pending-tickets', ticketControl.tickets.length );
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length );

        if( !ticket ){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    })
}