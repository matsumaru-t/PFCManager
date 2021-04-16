var app = new Vue({
    el: '#app',
    data: {
        selection: null,
        menu: [
            { name: 'お好み焼き', P: 140.0, F: 160.5, C: 200.1 },
            { name: 'グラノーラ', P: 241.1, F: 510.1, C: 41.0 }
        ],
        record: [
            { name: 'お好み焼き', P: 140.0, F: 160.5, C: 200.1, r: 1.0 }
        ],
        r: 1.0,
        ratio: [...Array(11).keys()].map(i => (i+5)/10),
        
        name: null,
        P: 0,
        F: 0,
        C: 0,

        goal: {
            P: 1000, F: 1000, C: 1000
        },
        menuSetting: {name: null, P: 0, F: 0, C: 0}
    },
    computed: {
        sum: function() {
           return {
               P: this.record.reduce((s, cur) => s + cur.P, 0),
               F: this.record.reduce((s, cur) => s + cur.F, 0),
               C: this.record.reduce((s, cur) => s + cur.C, 0),
           } 
        },
        rest: function() {
            let sum = this.sum
            return {
                P: this.goal.P-sum.P,
                F: this.goal.F-sum.F,
                C: this.goal.C-sum.C
            }
        },
        reversedMenu: function() {
            return this.menu.slice().reverse()
        },
        reversedRecord: function() {
            return this.record.slice().reverse()
        },
        debug: function() {
            return JSON.stringify(this.$data, null, 2)
        }
    },
    methods: {
        addRecord: function() {
            if (!this.selection) return
            this.record.push({
                name: this.name,
                P: this.P * this.r,
                F: this.F * this.r,
                C: this.C * this.r,
                r: this.r
            })
            this.store()
        },
        removeRecord: function(index) {
            this.$delete(this.record, index)
            this.store()
        },
        clearRecord: function() {
            this.record = []
            this.store()
        },
        addMenu: function() {
            if (!this.menuSetting) return
            this.menu.push(this.menuSetting)
            this.store()
        },
        removeMenu: function(index) {
            this.$delete(this.menu, index)
            this.store()
        },
        resetSelection: function() {
            this.selection = null
            this.name = null
        },
        setPFC: function() {
            if (!this.selection) return
            let food = this.menu.find(f => f.name === this.selection)
            this.name = food.name
            this.P = food.P
            this.F = food.F
            this.C = food.C
        },
        store: function() {
            localStorage.setItem('PFCData', JSON.stringify(this.$data))
            return
        },
        load: function() {
            let data = localStorage.PFCData
            if (data != null) {
                Object.assign(this.$data, JSON.parse(data))
            }
        },
        clear: function() {
            localStorage.removeItem('PFCData')
        },
    },
    created: function() {
        this.load()
    },
    beforeDestroyd: function() {
        this.store()
        console.log('stored!')
    }
})