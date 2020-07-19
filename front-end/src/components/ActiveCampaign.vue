<template>
    <div class="all-member-tbl" v-if="visibleFlag && dataFlag">
        <h2>All ActiveCampaign Member table</h2>
        <common-table
        :tableData="tableData"
        :columnData="columnData"
        >
        </common-table>
    </div>
</template>

<script>
export default {
    name: "ActiveCampaign",
    data () {
        return {
            tableData: null,
            columnData: [
              {
                prop: "name",
                label: "Full Name",
                sortable: true
              },
              {
                prop: "email",
                label: "Email",
                sortable: true
              },
              {
                prop: "phone",
                label: "Phone",
                sortable: true
              },
              {
                prop: "account",
                label: "Account",
                sortable: true
              },
              {
                prop: "date_created",
                label: "Date Created",
                sortable: true
              }
            ],
            dataFlag: false
        }
    },
    props: {
        data: {
            type: Array,
            required: false,
            default: null
        },
        visibleFlag: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    updated () {
        this.tableData = this.data;
        this.dataFlag = true;
    },
    watch: {
      data: function () {
        this.tableData = this.data;
      }
    }
};
</script>