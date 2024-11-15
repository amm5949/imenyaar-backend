const {ok, error} = require('../../../core/util/response');
const checkout = require('zarinpal-checkout').create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
const requestService = require('../services/request');
const config = require('config');


/**
 * @api {post} /api/subscription/buy/:id requestPayment
 * @apiName requestPayment
 * @apiGroup Subscription
 * @apiVersion 1.0.0
 * @apiDescription Send the account subscription type ID to this endpoint to start the payment process, 
 * result.url is the gateway address. Modify ZarinPal's callback URL from `/config/development.json`.
 * 
 * @apiSuccessExample {json} success-response:
 * HTTP/1.1 200 OK
{
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"subscription": {
			"id": 5,
			"user_id": 12,
			"account_type_id": 1,
			"start_date": "2021-08-10T19:30:00.000Z",
			"end_date": "2022-08-10T19:30:00.000Z",
			"cost": 10000,
			"is_verified": false,
			"authority": "000000000000000000000000000000511174",
            "ref_id": ""
		},
		"url": "https://sandbox.zarinpal.com/pg/StartPay/000000000000000000000000000000511174"
	}
}
 *
 */
const request = async (request, response) => {
    const account_type_id = request.params.id;
    const {user} = request;

    let subscription = await requestService.requestSubscription(user.id, account_type_id);
    if (subscription.hasOwnProperty('error')) {
        return error(response, 404, {
            en: 'Account subscription type not found.',
            fa: 'این نوع اشتراک در سیستم موجود نیست.'
        });
    }
    
    let zarinResponse;
    await checkout.PaymentRequest({
        Amount: subscription.cost, // in Tomans
        // TODO: set this url to actual server's
        CallbackURL: `${config.get('PAYMENT_CALLBACK')}/${subscription.id}`,
        Description: 'Imenyaar subscription payment'
    }).then(response => {
        zarinResponse = response;
        if (response.status === 100) {
            console.log(response.url);
        }
      }).catch(err => {
        console.error(err);
      });
    // console.log(zarinResponse);
    const subscriptionReceipt = await requestService.assignReceipt(subscription.id, zarinResponse.authority);
    return ok(response, {subscription: subscriptionReceipt, url: zarinResponse.url}, {}, 200);
}

module.exports = request;
