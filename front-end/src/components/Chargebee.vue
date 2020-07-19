<template>
    <div class="all-member-tbl" v-if="visibleFlag && dataFlag">
        <h2>All Chargebee Member table</h2>
        <common-table
        :tableData="tableData"
        :columnData="columnData"
        >
        </common-table>
    </div>
</template>

<script>
export default {
    name: 'Chargebee',
    data () {
        return {
            tableData: null,
            columnData: [
              {
                prop: "id",
                label: "Email",
                sortable: true
              },
              {
                prop: "recurring",
                label: "Recurring Items",
                sortable: true
              },
              {
                prop: "status",
                label: "Status",
                sortable: true
              },
              {
                prop: "created_at",
                label: "Created At",
                sortable: true
              },
              {
                prop: "next_billing",
                label: "Next Billing At",
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