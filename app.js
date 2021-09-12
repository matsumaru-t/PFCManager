const defaultRecord = [
    {name: "間食", r: -1, P: 0, F: 0, C: 0},
    {name: "夜ごはん", r: -2, P: 0, F: 0, C: 0},
    {name: "昼ごはん", r: -3, P: 0, F: 0, C: 0},
    {name: "朝ごはん", r: -4, P: 0, F: 0, C: 0},
]

var app = new Vue({
    el: '#app',
    data: {
        selection: null,
        menu: [],
        record: defaultRecord,
        r: 1.0,
        name: null,
        P: 0,
        F: 0,
        C: 0,

        goal: {
            P: 0, F: 0, C: 0
        },
        menuSetting: {name: null, P: 0, F: 0, C: 0},
        default: defaultRecord,
        mealTime: -4,

        curTab: 'A',
        tab: {
            A: defaultRecord,
            B: defaultRecord,
            C: defaultRecord,
        }
    },
    computed: {
        ratio: function() {
            return [...Array(11).keys()].map(i => (i+5)/10).concat([2, 3, 4, 5])
        },
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
        kcal: function() {
            return 4*this.sum.P + 9*this.sum.F + 4*this.sum.C
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
        initRecordForm: function() {
            this.selection = null
            this.P = 0
            this.F = 0
            this.C = 0
            this.r = 1
            this.store()
        },
        addRecord: function() {
            if (!this.selection) return
            this.name = this.selection
            let i = this.record.findIndex(f => f.r === this.mealTime)
            this.record.splice(i, 0, {
                name: this.name,
                P: this.P * this.r,
                F: this.F * this.r,
                C: this.C * this.r,
                r: this.r
            })
            this.initRecordForm()
        },
        removeRecord: function(index) {
            this.$delete(this.record, this.record.length-1-index)
            this.store()
        },
        clearRecord: function() {
            this.record = Object.assign([], defaultRecord)
            this.store()
        },
        addMenu: function() {
            if (!this.menuSetting.name) return
            this.menu.push({ ...this.menuSetting })
            this.menuSetting = {name: null, P: 0, F: 0, C: 0}
            this.store()
        },
        removeMenu: function(index) {
            this.$delete(this.menu, this.menu.length-1-index)
            this.store()
        },
        clearMenu: function() {
            this.menu = []
            this.store()
        },
        resetSelection: function() {
            this.selection = null
            this.name = null
        },
        resetMenuSettingName: function() {
            this.menuSetting.name = null
        },
        changeTab: function(tabIndex) {
            this.tab[this.curTab] = this.record.concat()
            this.curTab = tabIndex
            this.record = this.tab[tabIndex].concat()
        },
        setPFC: function() {
            if (!this.selection) return
            let food = this.menu.find(f => f.name === this.selection)
            if(!food) return
            this.name = food.name
            this.P = food.P
            this.F = food.F
            this.C = food.C
        },
        store: function() {
            localStorage.setItem('PFCData', JSON.stringify(this.$data))
            this.tab[this.curTab] = this.record.concat()
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
            alert("設定を全消去しました。")
        },
        importMenu: function() {
            let link = document.createElement('input')
            let reader = new FileReader()
            link.type = 'file'
            link.accept = '.json'
            link.click()

            link.addEventListener('change', () => {
                if (link.files.length === 0) return
                let file = link.files[0]
                reader.readAsText(file, 'UTF-8')
                reader.onload = () => {
                    try {
                        let res = JSON.parse(reader.result)
                        if (Array.isArray(res) && res.every(food => ("name" in food) && ("P" in food) && ("F" in food) && ("C" in food))) {
                            this.menu = res
                            this.store()
                        } else {
                            throw new Error("JSONの読み込みに失敗")
                        }
                    } catch (error) {
                        alert("読み込みに失敗しました。")
                    }
                }
            })
        },
        exportMenu: function() {
            var blob = new Blob([JSON.stringify(this.menu, null, 2)], {"type": "application/json"})
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'menu.json'
            link.click()
        },
        importRecord: function() {
            let link = document.createElement('input')
            let reader = new FileReader()
            link.type = 'file'
            link.accept = '.json'
            link.click()

            link.addEventListener('change', () => {
                if (link.files.length === 0) return
                let file = link.files[0]
                reader.readAsText(file, 'UTF-8')
                reader.onload = () => {
                    try {
                        let res = JSON.parse(reader.result)
                        if (Array.isArray(res) && res.every(food => ("name" in food) && ("P" in food) && ("F" in food) && ("C" in food) && ("r" in food))) {
                            this.record = res
                            this.store()
                        } else {
                            throw new Error("JSONの読み込みに失敗")
                        }
                    } catch (error) {
                        alert("読み込みに失敗しました。")
                    }
                }
            })
        },
        exportRecord: function() {
            var blob = new Blob([JSON.stringify(this.record, null, 2)], {"type": "application/json"})
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'record.json'
            link.click()
        },
        dragRecord(event, dragIndex){
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.setData('dragRecord-index', dragIndex)
        },
        dropRecord(event, dropIndex){
            const dragIndex = event.dataTransfer.getData('dragRecord-index')
            const deleteRecord = this.record.splice(this.record.length-1-dragIndex, 1)
            this.record.splice(this.record.length-dropIndex, 0, deleteRecord[0])
            this.store()
        },
        dragMenu(event, dragIndex) {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.setData('dragMenu-index', dragIndex)
        },
        dropMenu(event, dropIndex) {
            const dragIndex = event.dataTransfer.getData('dragMenu-index')
            const deleteMenu = this.menu.splice(this.menu.length-1-dragIndex, 1)
            this.menu.splice(this.menu.length-dropIndex, 0, deleteMenu[0])
            this.store()
        },
        notFood: function(food) {
            return food.r < 0
        },
    },
    created: function() {
        this.load()
        this.default = defaultRecord
    },
    beforeDestroyd: function() {
        this.store()
        console.log('stored!')
    }
})