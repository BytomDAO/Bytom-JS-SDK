import {signTransaction} from '../wasm/func';
import {handleAxiosError} from '../utils/http';

function transactionSDK(http) {
    this.http = http;
}


/**
 * List all the transactions related to a wallet or an address.
 *
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantlist-transactions
 * @param {String} guid unique id for each wallet
 * @param {String} address (optional) if provided, will only return transactions the address is related to
 * @returns {Promise}
 */
transactionSDK.prototype.list = function(guid, address) {
    let retPromise = new Promise((resolve, reject) => {
        let pm = {guid: guid};
        if (address) {
            pm.address = address;
        }
        this.http.request('merchant/list-transactions', pm).then(resp => {
            resolve(resp.data);
        }).catch(err => {
            reject(handleAxiosError(err));
        });
    });
    return retPromise;
};

/**
 * Submit a signed transaction to the chain.
 *
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantsubmit-payment
 * @param {String} guid unique id for each wallet
 * @param {String} raw_transaction raw transaction bytes encoded to string
 * @param {Array} signatures signed data of each signing instruction
 */
transactionSDK.prototype.submitPayment = function(guid, raw_transaction, signatures) {
    let retPromise = new Promise((resolve, reject) => {
        let pm = {guid: guid, raw_transaction: raw_transaction, signatures: signatures};
        this.http.request('merchant/submit-payment', pm).then(resp => {
            resolve(resp.data);
        }).catch(err => {
            reject(handleAxiosError(err));
        });
    });
    return retPromise;
};

/**
 * Build a raw transaction transfered from the wallet. 
 * May use all available addresses (under the wallet) as source addresses if not specified.
 * 
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantbuild-payment
 * @param {String} guid unique id for each wallet
 * @param {String} to destination address
 * @param {String} asset hexdecimal asset id
 * @param {Number} amount transfer amount
 * @param {String} from source address
 * @param {Number} fee transaction fee amount
 * @returns {Promise}
 */
transactionSDK.prototype.buildPayment = function(guid, to, asset, amount, from, fee) {
    let retPromise = new Promise((resolve, reject) => {
        let pm = {guid: guid, to: to, asset: asset, amount: amount};
        if (from) {
            pm.from = from;
        }
        if (fee) {
            pm.fee = fee;
        }
        this.http.request('merchant/build-payment', pm).then(resp => {
            resolve(resp.data);
        }).catch(err => {
            reject(handleAxiosError(err));
        });
    });
    return retPromise;
};

/**
 * sign transaction
 *
 * @param {String} transaction
 * @param {String} password
 * @returns {Promise}
 */
transactionSDK.prototype.signTransaction = function(transaction, password) {
    let data = {transaction:transaction, password:password};
    let retPromise = new Promise((resolve, reject) => {
        signTransaction(data).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
    return retPromise;
};

export default transactionSDK;