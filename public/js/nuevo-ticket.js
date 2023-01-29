// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket')
const btnCreate = document.querySelector('button')

const socket = io();

socket.on('connect', () => {
    btnCreate.disabled = false;

});

socket.on('disconnect', () => {
    btnCreate.disabled = true;
});

socket.on('last-ticket', (last) => {
    lblNuevoTicket.innerHTML = 'Ticket ' + last;
})

btnCreate.addEventListener( 'click', () => {    
    
    socket.emit( 'next-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerHTML = ticket;
    });

});