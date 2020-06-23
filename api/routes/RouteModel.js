const router = require('express').Router();
var chargebee = require("chargebee");
chargebee.configure({site : "kitces",
      api_key : "live_gNA7yDJiSinONuldkssTQQtI70Om0a5J"});

router.route('/all').get((req, res) =>{
    chargebee.subscription.list({
        "limit": 100,
        "sort_by[desc]" : "created_at",
    }).request(async function(error,result) {
        if(error){
            console.log("--------error", error);
        }else{
//             if (result.next_offset) {
//                 callOffset(result.next_offset, result.list,(dates) => {
//                     res.json(dates);
//                 });
//             }
            res.json(result.list);
        }
    });
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

module.exports = router;
