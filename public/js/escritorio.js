// Referencias HTML
const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblqueue = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('escritorio') ){
    window.location = 'index.html';
    throw new Error('El escritorio es obligario');
}

const desk = searchParams.get('escritorio');
lblDesk.innerHTML = desk;

divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAttend.disabled = false;

});

socket.on('disconnect', () => {
    btnAttend.disabled = true;
});

socket.on('pending-tickets', (queue) =>  {
    if ( queue === 0 ){
        lblqueue.style.display = 'none';
    } else{
        lblqueue.style.display = '';
        lblqueue.innerHTML = queue;
    }
})


btnAttend.addEventListener( 'click', () => {    
    socket.emit( 'attend-ticket', { desk }, ( { ok, ticket, msg } ) => {
        if ( !ok ){
            lblTicket.innerHTML = 'Nadie'
            return divAlert.style.display = '';
        }
        
        lblTicket.innerHTML = `Ticket ${ticket.number}`
        return divAlert.style.display = 'none';
    });
    
});