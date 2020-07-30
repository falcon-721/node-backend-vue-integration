const router = require('express').Router();

// import models
let db = require('../models');

// chargebee
var chargebee = require("chargebee");
chargebee.configure({site : "kitces",
      api_key : "live_gNA7yDJiSinONuldkssTQQtI70Om0a5J"});

// activecampaign
var ActiveCampaign = require("activecampaign");
var ac = new ActiveCampaign("https://kitces.api-us1.com", "44a80ac37cb045fa3f7741df00969d28ba52e8860bff259ebd2994d8d11415dfb6fb2e8e");

var request = require("request");

var options = {
    method: 'GET',
     headers: {
      'Api-Token': "44a80ac37cb045fa3f7741df00969d28ba52e8860bff259ebd2994d8d11415dfb6fb2e8e"
      },
      url: "https://kitces.api-us1.com/api/3/contacts",
      qs: {status: '-1', 'orders[email]': 'ASC', limit: 100, offset: 18397}
};

// cron job, it will be called every day at 01:00
// var cron = require('node-cron');
// cron.schedule('0 1 * * *', () => {
//     console.log('running a task every minute');
//     chargebee.subscription.list({
//         "limit": 100,
//         "sort_by[desc]" : "created_at",
//     }).request(async function(error,result) {
//         if (error) {
//             console.log("--------error", error);
//         } else {
//             if (result.next_offset) {
//                 // chargebee area
//                 callOffset(result.next_offset, result.list,(dates) => {

//                     const newChargebee = new db.chargebeeDB({
//                         chargebee: dates
//                     });

//                     console.log('-----totalData', newChargebee);
//                     newChargebee.save()
//                         .then(success => console.log('Success!'))
//                         .catch(err => console.log('Not saved!'));

//                     // activecampaign area
//                     request(options, function (error, response, body) {
//                         if (error) throw new Error(error);
//                             let offset = JSON.parse(response.body).meta.page_input.offset;
//                             let data = JSON.parse(response.body).contacts;
//                             if (JSON.parse(response.body).meta.page_input.offset < (JSON.parse(response.body).meta.total / 100).toFixed()) {
//                                     callActive(offset, data, async (results) => {

//                                         const newActive = new db.activeDB({
//                                             activecampaign: data
//                                         });

//                                         newActive.save()
//                                             .then(success => console.log('Success ActiveCampaign!'))
//                                             .catch(err => console.log('Not saved!'));

//                                         // search tags by email
//                                         var userData = [];
//                                         for (let i = 0; i < results.length; i++) {
//                                             var contact_exists = ac.api("contact/view?email=" + results[i].email, {});
//                                             await contact_exists.then(function(result) {
//                                                 // successful request
//                                                 userData.push(result);
//                                             }, function(result) {
//                                                 // request error
//                                             });
//                                         }
                                        
//                                         totalData["activecampaign"] = userData;
//                                         console.log('----------userData', userData);
//                                         console.log('--------secondTotalData', totalData);
//                                         res.json(totalData);
//                                     });
//                             }
//                     });
//                 });

//                 var contact_exists = ac.api("contact/paginator", {});
//                 contact_exists.then(function(result) {
//                     // successful request
//                     console.log("-------", result);
//                     callActive(result.offset, result.rows, (results) => {
//                         const newActive = new db.activeDB({
//                             activecampaign: results
//                         });

//                         newActive.save()
//                             .then(success => console.log('Success ActiveCampaign!'))
//                             .catch(err => console.log('Not saved!'));
//                     });
//                     // res.json(result);
//                 }, function(result) {
//                     // request error
//                 });
//             }
//         }
//     });

//     // activecampaign area
//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//             let offset = JSON.parse(response.body).meta.page_input.offset;
//             let data = JSON.parse(response.body).contacts;
//             if (JSON.parse(response.body).meta.page_input.offset < (JSON.parse(response.body).meta.total / 100).toFixed()) {

//                     callActive(offset, data, async (results) => {
//                         // res.json(results);

//                         // const newActive = new db.activeDB({
//                         //     activecampaign: data
//                         // });

//                         // newActive.save()
//                         //     .then(success => console.log('Success ActiveCampaign!'))
//                         //     .catch(err => console.log('Not saved!'));

//                         // // search tags by email
//                         var userData = [];
//                         for (let i = 0; i < results.length; i++) {
//                             var contact_exists = ac.api("contact/view?email=" + results[i].email, {});
//                             await contact_exists.then(function(result) {
//                                 // successful request
//                                 if (result.result_code === 1) {
//                                     userData.push(result);
//                                     const newActive = new db.activeDB({
//                                         created_at: result.created_timestamp,
//                                         full_name: result.name,
//                                         email: result.email,
//                                         phone: result.phone,
//                                         account: result.customer_acct_name,
//                                         tags: result.tags,
//                                         subscriptionid: result.subscriberid
//                                     });

//                                     newActive.save()
//                                         .then(success => console.log('Ok'))
//                                         .catch(err => console.log('Error', err));
//                                 }
//                                 console.log('-------userData', userData.length);
//                             }, function(result) {
//                                 // request error
//                             });
//                         }

//                         res.json(userData);
//                     });
//             }
//     });
// });

router.route('/all').get((req, res) =>{
    // request(options, function (error, response, body) {
    //     if (error) throw new Error(error);
    //         let offset = JSON.parse(response.body).meta.page_input.offset;
    //         let data = JSON.parse(response.body).contacts;
    //         // if (JSON.parse(response.body).meta.page_input.offset < (JSON.parse(response.body).meta.total / 100).toFixed()) {

    //                 callActive(offset, data, async (results) => {
    //                     // search tags by email
    //                     var userData = [];
    //                     for (let i = 0; i < results.length; i++) {
    //                         var contact_exists = ac.api("contact/view?email=" + results[i].email, {});
    //                         await contact_exists.then(function(result) {
    //                             // successful request
    //                             if (result.result_code === 1) {
    //                                 userData.push(result);
    //                                 const newActive = new db.activeDB({
    //                                     created_at: result.created_timestamp,
    //                                     full_name: result.name,
    //                                     email: result.email,
    //                                     phone: result.phone,
    //                                     account: result.customer_acct_name,
    //                                     tags: result.tags,
    //                                     subscriptionid: result.subscriberid
    //                                 });

    //                                 newActive.save()
    //                                     .then(success => console.log('Ok'))
    //                                     .catch(err => console.log('Error', err));
    //                             }
    //                             console.log('-------userData', userData.length);
    //                         }, function(result) {
    //                             // request error
    //                         });
    //                     }

    //                     res.json(userData);
    //                 });
    //         // }
    // });

/*    
    chargebee.subscription.list({
        "limit": 100,
        "sort_by[desc]" : "created_at",
    }).request(async function(error,result) {
        if (error) {
            console.log("--------error", error);
        } else {
            if (result.next_offset) {
                // chargebee area
                callOffset(result.next_offset, result.list,(dates) => {

                    const newChargebee = new db.chargebeeDB({
                        chargebee: dates
                    });

                    newChargebee.save()
                        .then(success => console.log('Success!'))
                        .catch(err => console.log('Not saved!'));
                });
            }
        }
    });
*/
    // find chargebee data
     db.chargebeeDB.find()
         .then(data => {
             console.log('data', data);

             // total data
             let totalData = {
                 chargebee: data
             };

             // find activecampaign data
             db.activeDB.find()
                 .then(response => {
                     totalData["activecampaign"] = response;
                     res.json(totalData);
                 })
                 .catch(err => console.log('Error', err));
         })
         .catch(err => res.status(400).json(err));
});

async function callOffset (next, before,cb) {
    let allData = [...before];
    if (next) {
        await chargebee.subscription.list({
              "limit": 100,
              "sort_by[desc]": "created_at",
              "offset": next
            }).request(function(err, response) {
                console.log('---------length', allData.length);
                if(response.next_offset) {
                    allData = [...allData, ...response.list];
                    callOffset(response.next_offset, allData, cb);
                } else {
                    allData = [...allData, ...response.list];
                    cb(allData);
                }
            });
    }
}

// async function callActive (offset, data, cb) {
// 	console.log('offset', offset);
// 	let activecampaignData = [...data];
// 	// console.log('----------', activecampaignData.length);
// 	var new_contact_exists = ac.api("contact/paginator", {offset: parseInt(offset) + 100});
// 	await new_contact_exists.then(function (newResult) {
// 		activecampaignData = [...activecampaignData, ...newResult.rows];
// 		if (Math.floor(newResult.offset / 100) < Math.floor(newResult.total / 100)) {
// 			callActive(newResult.offset, activecampaignData, cb);
// 		} else {
// 			cb(activecampaignData);
// 		}
// 	}, function (err) {
// 		console.log(err);
// 	});
// }

async function callActive (offset, data, cb) {
	console.log('offset', offset);
	let activecampaignData = [...data];
	var options = {
	  method: 'GET',
	  headers: {
	  	'Api-Token': "44a80ac37cb045fa3f7741df00969d28ba52e8860bff259ebd2994d8d11415dfb6fb2e8e"
	  },
	  url: 'https://kitces.api-us1.com/api/3/contacts',
	  qs: {status: '-1', 'orders[email]': 'ASC', limit: 100, offset: parseInt(offset) + 100}
	};

	await request(options, function (error, response, body) {
    	if (error) throw new Error(error);
        let newContacts = JSON.parse(response.body).contacts;
    	activecampaignData = [...activecampaignData, ...newContacts];
        if (Math.floor(JSON.parse(response.body).meta.page_input.offset / 100) < Math.floor(JSON.parse(response.body).meta.total / 100)) {
			let newOffset = JSON.parse(response.body).meta.page_input.offset;
			callActive(newOffset, activecampaignData, cb);
		} else {
			cb(activecampaignData);
		}
	});
}

module.exports = router;