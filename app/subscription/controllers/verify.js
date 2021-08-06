const {ok, error} = require('../../../core/util/response');
const checkout = require('zarinpal-checkout').create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
const verifyService = require('../services/verify');
const fetchService = require('../services/fetch_subscription');

/**
 * @api {get} /api/subscription/verify/:id verifyPayment
 * @apiName verifyPayment
 * @apiGroup Subscription
 * @apiVersion 1.0.0
 * @apiDescription Send the subscription ID to this endpoint
 *  to check if it's paid.
 * @apiSuccess {Object} subscription Subscription details.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
	"status": "ok",
	"message": {
		"en": "Request was successful",
		"fa": "درخواست موفقیت آمیز بود"
	},
	"result": {
		"subscription": {
			"id": 9,
			"user_id": 12,
			"account_type_id": 1,
			"start_date": "2021-08-11T00:00:00.000Z",
			"end_date": "2023-08-11T17:18:28.857Z",
			"cost": 10000,
			"is_verified": true,
			"authority": "000000000000000000000000000000511111",
            "ref_id": "12345678"
		}
	}
}
 * @apiError (403) Forbidden cannot access this subscription id.
 * @apiError (404) NotFound subscription id doesn't exist.
 * @apiError (402) Payment has not been verified.
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 402 PaymentRequired
 * {
	"status": "error",
	"message": {
		"en": "Payment has not been verified.",
		"fa": "پرداخت تأیید نشده است."
	}
}
 */

const verify = async (request, response) => {
    const id = request.params.id;
    // const {user} = request;
    let subscription = await fetchService.getSubscription(id);
    if (subscription === undefined) {
        return error(response, 404, {
            en: 'subscription not found',
            fa: 'اطلاعات اشتراک یافت نشد.'
        });
    }
    // if (user.roles[0].name !== 'admin' && user.id !== subscription.user_id) {
    //     return error(response, 403, {
    //         en: 'Forbidden access.',
    //         fa: 'دسترسی مجاز نیست.'
    //     });
    // }
    const zarinResponse = await checkout.PaymentVerification({
        Amount: subscription.cost,
        Authority: subscription.authority,
    });
    if (zarinResponse.status === 101 || zarinResponse.status === 100) {
        subscription = await verifyService(subscription.id, zarinResponse.RefID);
        return ok(response, {
            subscription,
            subscription
        }, {}, 200);
    } else{
        return error(response, 402, {
            en: "Payment has not been verified.",
            fa: "پرداخت تأیید نشده است."
        });
     }
}

module.exports = verify;
