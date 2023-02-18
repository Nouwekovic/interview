import $ from "./jQuery.js";

export default class CashRegister {

    constructor() {
        if (localStorage.getItem('currentCurrency') === null) {
            localStorage.setItem('currentCurrency', 'CZK');
        }

        this._getLastVisited();

        this.currentCurrency = '';
        this.tempJSONData = null;

        this.czkNominalValues = [5000, 2000, 1000, 200, 100, 50, 20 , 10, 5, 2 , 1];
        this.eurNominalValues = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01];

        this._axiosInit();
    }

    _setUsers(users) {
        this.users = users;
    }

    _setShops(shops) {
        this.shops = shops;
    }

    _setCashRegisters(cashRegisters) {
        this.cashRegisters = cashRegisters;
    }

    _refreshSections() {
        this.nominalValues = this.currentCurrency === 'CZK' ? this.czkNominalValues : this.eurNominalValues;

        $.each(this.nominalValues, (index, value) => {
            const currencyInputsBlock = $('<div>').addClass('currency-block');

            const multiplier = $('<input />').addClass('currency').attr({'data-multiplier': true, 'data-nominal-value': value});
            const multiplicand = $('<input />').addClass('currency').val(value).attr({'data-multiplicand': true, 'disabled': true});
            const product = $('<input />').addClass('currency').attr({'data-product': true, 'disabled': true, 'data-product-nominal-value': value}).val(0);

            const subtotal = this.subtotal;
            const total = this.total;
            const reserve = this.reserve;
            const bank = this.bank;

            multiplier.on('propertychange input change', (event) => {
                let inputValue = parseInt(event.currentTarget.value);
                let productValue = $.isNumeric(inputValue) ?  inputValue * parseFloat(value) : 0;
                product.val(productValue);
                let sum = this._getTotalSum();
                subtotal.val(parseFloat(sum));
                this._setTotalComputedValue(reserve, bank, total, sum);
            });

            $('.summary[data-bank], .summary[data-reserve]').on('propertychange input change', () => {
                let sum = this._getTotalSum();
                this._setTotalComputedValue(reserve, bank, total, sum);
            });

            currencyInputsBlock.append(multiplier, multiplicand, product);
            this.cashRegisterFormWrapper.append(currencyInputsBlock, this.summaryWrapper, this.submitWrapper);
        });
        $('.summary').wrap('<div class="summary-input-group"></div>')
    }
    async _axiosInit() {
        await this._axiosGetUsers();
        await axios.get('api/shops')
            .then((res) => {
                this._setShops(res.data);
            })
            .catch((error) => {
                console.log(error.res.data);
            }).finally(() => {
                this._init();
            });
    }

    _init() {
        this._initSections();
        this._refreshSections();
        this._addTextAndSigns();
    }

    _initSections() {
        this.currentCurrency = localStorage.getItem('currentCurrency');

        this.cashRegisterFormWrapper = $('<div></div>').addClass('cashRegisterWrapper');
        const app = $('#app');
        app.append(this.cashRegisterFormWrapper);

        this.selectsWrapper = $('<div></div>').addClass('selectsWrapper');
        this.shopsSelect = $('<select id="shops"></select>');
        this.usersSelect = $('<select id="users"></select>');

        this.headingsWrapper = $('<div></div>').addClass('headingsWrapper');
        this.cashRegisterNo = $('<select id="cash-registers"></select>').addClass('heading');
        this.bankNoteValue = $('<span></span>').addClass('heading').html("hodnota<br>Bankovky");
        this.currencySwitch = $('<button></button>').addClass('currency-switch').text(this.currentCurrency);

        this.summaryWrapper = $('<div></div>').addClass('summaryWrapper');
        this.subtotal = $('<input/>').addClass('summary').attr({'data-subtotal': true, 'disabled': true});
        this.bank = $('<input/>').addClass('summary').attr('data-bank', true).val(0);
        this.reserve = $('<input/>').addClass('summary').attr('data-reserve', true).val(0);
        this.total = $('<input/>').addClass('summary').attr({'data-total': true , 'disabled': true}).val(0);

        this.submitWrapper = $('<div></div>').addClass('submitWrapper');
        this.dateCreated = $('<input/>').addClass('dateInput').attr({'data-date': true, 'disabled': true});
        this.saveRegister = $('<input/>').addClass('submitButton').attr('type', "button").val("Uložit");

        this.submitWrapper.append(this.dateCreated ,this.saveRegister);
        this.selectsWrapper.append(this.shopsSelect, this.usersSelect)
        this.cashRegisterFormWrapper.append(this.selectsWrapper, this.headingsWrapper);
        this.headingsWrapper.append(this.cashRegisterNo, this.bankNoteValue, this.currencySwitch);

        this.summaryWrapper.append(this.subtotal, this.bank, this.reserve, this.total);

        this.shopsList = $('#shops');

        $.each(this.shops, function (i, item) {
            $('#shops').append($('<option></option>', {
                value: item.id,
                text : 'Obchod ' + item.id
            }));
        });


        $.each(this.users, function (i, item) {
            $('#users').append($('<option></option>', {
                value: item.id,
                text : item.name
            }));
        });

        this.firstPass = true;

        if (this.lastShopId !== undefined) {
            $('#shops').val(this.lastShopId).trigger('change');
        } else {
            $('#shops').val($("#shops option:first").val()).trigger('change');
        }

        this._axiosGetCashRegisters($('#shops').find(":selected").val());

        this.shopsList.on('change', (event) => {
            this._axiosGetCashRegisters(event.target.value);
        });

        $('#cash-registers').on('change', async (event) => {
            await this._axiosGetCashRegisterData(event.target.value);
            if (!this.firstPass) {
                this._saveLastCashRegisterIds();
            }
            this.firstPass = false;
        });

        $(this.saveRegister).on('click', async () => {
            await this._saveJson();
        });

        $(this.currencySwitch).on('click', () => {
            this._switchCurrency();
        });
    }

    _axiosGetCashRegisters(shopId) {
        axios.get('/api/cashregisters/fk/' + shopId)
            .then((res) => {
                this._setCashRegisters(res.data);
                let i = 1;
                $('#cash-registers').html('');
                $.each(this.cashRegisters, function (index, item) {
                    $('#cash-registers').append($('<option></option>', {
                        value: item.id,
                        text: 'Pokladna ' + i++
                    }));
                })
                if (this.lastCashRegisterId !== undefined && this.firstPass) {
                    $('#cash-registers').val(this.lastCashRegisterId).trigger('change');
                } else {
                    $('#cash-registers').val($("#cash-registers option:first").val()).trigger('change');
                }

                $('#cash-registers').find(":selected").trigger('change');
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
            });
    }

    _saveLastCashRegisterIds() {
        localStorage.setItem('lastCashRegisterState', JSON.stringify({
            'shopId': $('#shops').find(":selected").val(),
            'cashRegisterId': $('#cash-registers').find(":selected").val(),
        }));
    }

    async _axiosGetCashRegisterData(cashRegisterId, fetchOnly) {
         await axios.get('/api/cashregisters/' + cashRegisterId)
            .then((res) => {
                if (!fetchOnly) {
                    if (res.data[0] === null) {
                        $('.currency[data-multiplier]').val('').trigger('change');
                        $('input[data-date]').val('');
                        $('input[data-reserve]').val('');
                        $('input[data-bank]').val('');
                        return false;
                    }

                    let parsedData;
                    if (this.currentCurrency === 'CZK') {
                        parsedData = res.data[0].CZK !== undefined ? JSON.parse(res.data[0].CZK) : null;
                    } else {
                        parsedData = res.data[0].EUR !== undefined ? JSON.parse(res.data[0].EUR) : null;
                    }
                    let time = this.currentCurrency === 'CZK' ? res.data[0].time_modified_CZK : res.data[0].time_modified_EUR ;
                    $('input[data-date]').val(time);
                    $.each(parsedData, (index, value) => {
                        let multiplierEl = $('input[data-nominal-value = "' + index + '"]');
                        if (index === 'reserve') {
                            $(this.reserve).val(value);
                        } else if (index === 'bank') {
                            $(this.bank).val(value);
                        } else {
                            multiplierEl.val(value).trigger('change');
                        }
                        let sum = this._getTotalSum();
                        this.subtotal.val(parseFloat(sum));
                        this._setTotalComputedValue(this.reserve, this.bank, this.total, sum);
                    });
                } else {
                    this.tempJSONData = res.data[0];
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    async _axiosGetUsers() {
            await axios.get('api/users')
                .then((res) => {
                    this._setUsers(res.data);
                    console.log(res.data);
                })
    }

    _getLastVisited () {
        let lastItems = JSON.parse(localStorage.getItem('lastCashRegisterState'));
        $.each(lastItems, (index,value) => {
            if (index === 'cashRegisterId') {
                this.lastCashRegisterId = parseInt(value);
            } else {
                this.lastShopId = parseInt(value);
            }
        });

    }


    _addTextAndSigns() {
        this.subtotal.before('<span>Mezisoučet:</span>');
        this.bank.before('<span>Stranou do banky:</span>');
        this.reserve.before('<span>Rezerva:</span>');
        this.total.before('<span>Součet:</span>');


        $('.currency[data-multiplier]').after('<span>X</span>');
        $('.currency[data-multiplicand]').after('<span>=</span>');
        $('.currency[data-product], .summary').after('<span>'+ (this.currentCurrency === 'CZK' ? 'Kč' : '€') + '</span>')

    };

    _isFloat(value) {
       return $.isNumeric(value) ? parseFloat(value) : 0;
    }

    _isNumber(value) {
        return $.isNumeric(value) ? parseInt(value) : 0;
    }

    _switchCurrency () {
        $('#app').html('');
        localStorage.getItem('currentCurrency') === 'CZK' ? localStorage.setItem('currentCurrency', 'EUR') : localStorage.setItem('currentCurrency', 'CZK');
        this.currentCurrency = localStorage.getItem('currentCurrency');
        this._getLastVisited();
        this._init();
    }

     async _saveJson() {
         let cashRegisterId = $('#cash-registers').find(':selected').val();

         await this._axiosGetCashRegisterData(cashRegisterId, true);
         let cashRegisterData = this.tempJSONData;
         let object = cashRegisterData !== null ? cashRegisterData : {};
         object[this.currentCurrency] = {};

         let now = new Date();
         let dateNow = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
         object['time_modified_' + this.currentCurrency] = dateNow;
         $('input[data-date]').val(dateNow);

         let currencyMultiplierEls = $('input[data-multiplier]');

         $.each(this.nominalValues, (index, value) => {
             let item = {};
             item[value] = this._isNumber(currencyMultiplierEls.eq(index).val());
             item['reserve'] = this._isNumber($('input[data-reserve]').val());
             item['bank'] = this._isNumber($('input[data-bank]').val());
             Object.assign(object[this.currentCurrency], item);
         });
         object[this.currentCurrency] = JSON.stringify(object[this.currentCurrency]);

         let jsonData = JSON.stringify(object);

         axios.put('/api/cashregisters/up/' + cashRegisterId, {data: jsonData})
             .then(response => {
                 $('#app').prepend('<span id="flash">Uloženo</span>');
                 setTimeout(() => {
                     $('#flash').remove();
                 }, 1000)
             }).catch(error => console.log(error.response.data.errors))

         /*axios.put('/api/cashregisters/up/' + cashRegisterId, {data: jsonData})
             .then(response => {
                 $('#app').prepend('<span id="flash">Uloženo</span>');
                 setTimeout(() => {
                     $('#flash').remove();
                 }, 1000)
             }).catch(error => console.log(error.response.data.errors))*/
     }

    _setTotalComputedValue(reserve, bank, total, sum) {
        let reserveValue = this._isFloat(reserve.val());
        let bankValue = this._isFloat(bank.val());
        total.val(parseFloat(sum) + reserveValue - bankValue);
    }

    _getTotalSum() {
        let sum = 0;

        $('.currency[data-product]').each(function () {
            sum += parseFloat(this.value, 10);
        });

        return sum;
    }
}
