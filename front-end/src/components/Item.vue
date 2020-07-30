<template>
    <div class="api-body">
        <h2>API Integration</h2>
        <!-- menu bar -->
        <div class="select-bar">
            <div class="left-section">
                <Datepicker
                    v-model="date"
                    clear-button-icon="fa fa-times"
                    calendar-button-icon="fa fa-calendar"
                    :calendar-button="true"
                    :clear-button="true"
                    :placeholder="'When?'"
                    @selected="changeDate"
                />
            </div>

            <div class="right-section">
                <!-- select section -->
                <!-- <div class="select-area">
                    <button @click="changeStyle(1)" :style="(chargebeeFlag === true) ? 'background: #ABE5C4': ''">Chargebee</button>
                    <button @click="changeStyle(-1)" :style="(chargebeeFlag === false) ? 'background: #ABE5C4': ''">ActiveCampaign</button>
                </div> -->

                <downloadexcel
                    class   = "btn-default download-btn"
                    :data   = "json_data"
                    :fields = "fields"
                    worksheet = "My Worksheet"
                    type="csv"
                    :before-generate = "startDownload"
                    name = "statistics.xls">
                    <mdb-icon icon="arrow-down" title="download" />
                </downloadexcel>
            </div>
        </div>

        <!-- total table -->
        <div v-if="activeFlag">
            <h1>Statistics</h1>
            <table class="total-tbl">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Metric</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in json_data" :key="index">
                        <td>{{ item.account }}</td>
                        <td>{{ item.metric }}</td>
                        <td>{{ item.count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- chargebee -->
        <!-- <Chargebee
            :data="chargebee_data"
            :visibleFlag="chargebeeFlag"
        /> -->

        <!-- activecampaign -->
        <!-- <ActiveCampaign
            :data="active_data"
            :visibleFlag="!chargebeeFlag"
        /> -->

        <!-- loading section -->
        <div class="loading-area" v-if="loadingFlag">
            <span>Now, So many data is loading.</span><br>
            <span>Just a moment...</span>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import { api } from '../services/api';
import downloadexcel from "vue-json-excel";
import moment from 'moment';
// import Chargebee from './Chargebee';
// import ActiveCampaign from './ActiveCampaign';
import { mdbIcon } from 'mdbvue';

let now = new Date();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let basic_data = [
    {
        account: "Chargebee",
        metric: "All Members",
        count: 0
    },
    {
        account: "Chargebee",
        metric: "Basic Members",
        count: 0
    },
    {
        account: "Chargebee",
        metric: "Premier Members",
        count: 0
    },
    {
        account: "Chargebee",
        metric: "New Monthly Basic Purchases",
        count: 0
    },
    {
        account: "Chargebee",
        metric: "Monthly Basic Cancellations",
        count: 0
    },
    {
        account: "Chargebee",
        metric: "Monthly Premier Purchase Members",
        count: 0
    },
    {
        account: "Chargebee",
        metric: "Premier Schedule Members",
        count: 0
    },
    {
        account: "Active Campaign",
        metric: "All Members",
        count: 0
    },
    {
        account: "Active Campaign",
        metric: "Current Group Members",
        count: 0
    },
    {
        account: "Active Campaign",
        metric: "Current XYPN Members",
        count: 0
    },
    {
        account: "Active Campaign",
        metric: "Current Complimentary Members",
        count: 0
    },
    {
        account: "Active Campaign",
        metric: "Premier Auto-Renewed Month to Yesterday",
        count: 0
    },
];

export default {
  name: 'Item',
  components: {
    downloadexcel,
    Datepicker,
    // Chargebee,
    // ActiveCampaign,
    mdbIcon
  },
  data () {
    return {
        actions: "",
        activeFlag: false,
        chargebeeData: null,
        activecampaignData: null,
        // chargebee_data: null,
        // active_data: null,
        loadingFlag: true,
        filename: "All_Members",
        date: null,
        chargebeeFlag: null,
        fields: {
            'Account': 'account',
            'Metric': 'metric',
            'Totals': 'count'
        },
        // chargebee_json_fields: {
        //     'Email': 'id',
        //     'Recurring Items': 'recurring',
        //     'Status': 'status',
        //     'Created At': 'created_at',
        //     'Next Billing At': 'next_billing'
        // },
        // active_json_fields: {
        //     'Full Name': 'name',
        //     'Email': 'email',
        //     'Phone': 'phone',
        //     'Account': 'account',
        //     'Date Created': 'date_created'
        // },
        json_data: null,
        json_meta: [
            [
                {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ]
    };
  },
  methods: {
    startDownload: function () {
        if (this.activeFlag) {
            if (this.json_data.length === 0) {
                window.alert('There is no data to download!!!');
            } else {
                window.alert('Start Downloading');
            }
        } else {
            window.alert('Now loading data, Just a moment');
        }
    },
    changeDate: function (date) {
        for (let i = 0; i < 12; i++) {
            this.json_data[i].count = 0;
        }

        // search by date
        if (this.activeFlag) {
            if (date !== null) {
                // chargebee
                this.chargebeeData.forEach(item => {
                    // all member
                    if (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate()) {
                        this.json_data[0].count += 1;
                    }

                    // basic and premier
                    if (item.subscription.billing_period_unit !== "year") {
                        if ((item.subscription.status === "active" || item.subscription.status === "non_renewing") && (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate())) {
                            this.json_data[1].count += 1; // basic members
                        }
                    } else {
                        if ((item.subscription.status === "active" || item.subscription.status === "non_renewing") && (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate())) {
                            this.json_data[2].count += 1; // premier members
                        }
                    }

                    // new monthly basic purchase
                    if (item.subscription.billing_period_unit !== "year" && (now.getMonth() === moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate().getMonth() && now.getYear() === moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate().getYear()) && (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate())) {
                        this.json_data[3].count += 1;
                    }

                    // monthly basic cancellations
                    if (item.subscription.billing_period_unit !== "year" && item.subscription.status === "cancelled" && item.subscription.billing_period == 1 && (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate())) {
                        this.json_data[4].count += 1;
                    }

                    // monthly premier purchase members
                    if (item.subscription.billing_period_unit === "year" && item.subscription.status === "cancelled" && item.subscription.billing_period == 1 && (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate())) {
                        this.json_data[5].count += 1;
                    }

                    // premier schedule members
                    if (item.subscription.billing_period_unit === "year" && item.subscription.billing_period == 1 && (moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate() > moment(date).toDate())) {
                        this.json_data[6].count += 1;
                    }
                });

                // activecampaign
                this.activecampaignData.forEach(item => {
                    // all members
                    if (moment(item.created_at).toDate() <= moment(date).toDate()) {
                        this.json_data[7].count += 1; // activecampaign all members
                        
                        item.tags.forEach(tag => {
                            switch (tag) {
                                case "MemberType-Kitces-Report-Group-Member": // current group members
                                    this.json_data[8].count += 1;
                                    break;
                                case "MemberType-XYPN-Member-Subscription": // current xypn members
                                    this.json_data[9].count += 1;
                                    break;
                                case "MemberType-The-Kitces-Report-Complimentary": // current complimentary members
                                    this.json_data[10].count += 1;
                                    break;
                                default:
                                    break;
                            }
                        });

                        // premier auto-renewed
                        if (item.tags.indexOf("Reports-MemberRenewal-" + months[now.getMonth()] + "-2020-Expiration") !== -1 && item.tags.indexOf("Reports-MemberRenewal-" + months[now.getMonth()] + "-2021-Expiration")) {
                            this.json_data[11].count += 1;
                        }
                    }
                })
            } else {
                // chargebee
                this.json_data[0].count =this.chargebeeData.length; // all members
                this.chargebeeData.forEach(item => {
                    
                    // basic and premier
                    if (item.subscription.billing_period_unit !== "year") {
                        if (item.subscription.status === "active" || item.subscription.status === "non_renewing") {
                            this.json_data[1].count += 1; // basic members
                        }
                    } else {
                        if (item.subscription.status === "active" || item.subscription.status === "non_renewing") {
                            this.json_data[2].count += 1; // premier members
                        }
                    }

                    // new monthly basic purchase
                    if (item.subscription.billing_period_unit !== "year" && (now.getMonth() === moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate().getMonth() && now.getYear() === moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate().getYear())) {
                        this.json_data[3].count += 1;
                    }

                    // monthly basic cancellations
                    if (item.subscription.billing_period_unit !== "year" && item.subscription.status === "cancelled" && item.subscription.billing_period == 1) {
                        this.json_data[4].count += 1;
                    }

                    // monthly premier purchase members
                    if (item.subscription.billing_period_unit === "year" && item.subscription.status === "cancelled" && item.subscription.billing_period == 1) {
                        this.json_data[5].count += 1;
                    }

                    // premier schedule members
                    if (item.subscription.billing_period_unit === "year" && item.subscription.billing_period == 1) {
                        this.json_data[6].count += 1;
                    }
                });

                // activecampaign
                this.json_data[7].count = this.activecampaignData.length; // activecampaign all members
                this.activecampaignData.forEach(item => {
                    item.tags.forEach(tag => {
                        switch (tag) {
                            case "MemberType-Kitces-Report-Group-Member": // current group members
                                this.json_data[8].count += 1;
                                break;
                            case "MemberType-XYPN-Member-Subscription": // current xypn members
                                this.json_data[9].count += 1;
                                break;
                            case "MemberType-The-Kitces-Report-Complimentary": // current complimentary members
                                this.json_data[10].count += 1;
                                break;
                            default:
                                break;
                        }
                    });

                    // premier auto-renewed
                    if (item.tags.indexOf("Reports-MemberRenewal-" + months[now.getMonth()] + "-2020-Expiration") !== -1 && item.tags.indexOf("Reports-MemberRenewal-" + months[now.getMonth()] + "-2021-Expiration")) {
                        this.json_data[11].count += 1;
                    }
                });
            }
        }
    }
    // changeStyle: function (style) {
    //     if (this.activeFlag) {
    //         if (style === 1) {
    //             this.chargebeeFlag = true;
    //         } else {
    //             this.chargebeeFlag = false;
    //         }
    //     }
    // }
  },
  async mounted () {
    let totalData = await api.getChargebees();
    console.log('totalData', totalData);
    this.chargebeeFlag = true;
    this.activeFlag = true;
    
    this.chargebeeData = totalData.chargebee[0].chargebee;
    this.activecampaignData = totalData.activecampaign;
    // save data from chargebee
    // let chargebeeTables = [];
    // totalData.chargebee[0].chargebee.forEach(item => {
    //     let tableItem = {};
    //     tableItem["id"] = item.customer.email;

    //     // check basic or premier
    //     if (item.subscription.billing_period_unit === "year") {
    //         tableItem["recurring"] = "Premier Member";
    //     } else {
    //         tableItem["recurring"] = "Basic Member";
    //     }

    //     switch (item.subscription.status) {
    //         case "future":
    //             tableItem["status"] = "FUTURE";
    //             break;
    //         case "in_trial":
    //             tableItem["status"] = "IN TRIAL";
    //             break;
    //         case "active":
    //             tableItem["status"] = "ACTIVE";
    //             break;
    //         case "non_renewing":
    //             tableItem["status"] = "NON RENEWING";
    //             break;
    //         case "paused":
    //             tableItem["status"] = "PAUSED";
    //             break;
    //         case "cancelled":
    //             tableItem["status"] = "CANCELLED";
    //             break;
    //         default:
    //             break;
    //     }
    //     tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
    //     tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
    //     chargebeeTables.push(tableItem);
    // });

    // this.chargebee_data = chargebeeTables;
    this.loadingFlag = false;
    
    basic_data[0].count = totalData.chargebee[0].chargebee.length; // all members
    totalData.chargebee[0].chargebee.forEach(item => {
        
        // basic and premier
        if (item.subscription.billing_period_unit !== "year") {
            if (item.subscription.status === "active" || item.subscription.status === "non_renewing") {
                basic_data[1].count += 1; // basic members
            }
        } else {
            if (item.subscription.status === "active" || item.subscription.status === "non_renewing") {
                basic_data[2].count += 1; // premier members
            }
        }

        // new monthly basic purchase
        if (item.subscription.billing_period_unit !== "year" && (now.getMonth() === moment(item.subscription.created_at,"YYYY-MM-DD hh:mm:ss").toDate().getMonth() && now.getYear() === moment(item.subscription.created_at, "YYYY-MM-DD hh:mm:ss").toDate().getYear())) {
            basic_data[3].count += 1;
        }

        // monthly basic cancellations
        if (item.subscription.billing_period_unit !== "year" && item.subscription.status === "cancelled" && item.subscription.billing_period == 1) {
            basic_data[4].count += 1;
        }

        // monthly premier purchase members
        if (item.subscription.billing_period_unit === "year" && item.subscription.status === "cancelled" && item.subscription.billing_period == 1) {
            basic_data[5].count += 1;
        }

        // premier schedule members
        if (item.subscription.billing_period_unit === "year" && item.subscription.billing_period == 1) {
            basic_data[6].count += 1;
        }
    });

    // save activecampaign data
    // let activecampaignTables = [];
    // totalData.activecampaign.forEach(item => {
    //     let table = {};
    //     table["name"] = item.full_name;
    //     table["email"] = item.email;
    //     table["phone"] = item.phone;
    //     table["account"] = item.account;
    //     table["date_created"] = moment(item.created_at).add(8, "hours").format("MM/DD/YYYY hh:mm a");
    //     activecampaignTables.push(table);
    // });

    // this.active_data = activecampaignTables;

    // search activecampaign
    basic_data[7].count = totalData.activecampaign.length; // activecampaign all members
    totalData.activecampaign.forEach(item => {
        item.tags.forEach(tag => {
            switch (tag) {
                case "MemberType-Kitces-Report-Group-Member": // current group members
                    basic_data[8].count += 1;
                    break;
                case "MemberType-XYPN-Member-Subscription": // current xypn members
                    basic_data[9].count += 1;
                    break;
                case "MemberType-The-Kitces-Report-Complimentary": // current complimentary members
                    basic_data[10].count += 1;
                    break;
                default:
                    break;
            }
        });

        // premier auto-renewed
        if (item.tags.indexOf("Reports-MemberRenewal-" + months[now.getMonth()] + "-2020-Expiration") !== -1 && item.tags.indexOf("Reports-MemberRenewal-" + months[now.getMonth()] + "-2021-Expiration")) {
            basic_data[11].count += 1;
        }
    });

    // save data for download
    this.json_data = basic_data;
  }
}
</script>