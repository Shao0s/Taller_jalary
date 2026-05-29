// EVITAR VOLVER ATRÁS

window.history.forward();

function noBack() {
    window.history.forward();
}

setTimeout(() => {
    noBack();
}, 0);

window.onunload = function(){};