import './bootstrap';
import $ from "./jQuery.js";

import CashRegister from "./CashRegister";

window.$ = $;
// Zapsání a uložení stavu hotovosti v pokladně
$(() => {
    if ($('#app').length !== 0) {
        const cashRegister = new CashRegister();
    }
})



