const classes = [
  "Squire", "Chemist", "Knight", "Archer", "Monk", "Priest", "Wizard", "Time Mage", "Summoner", "Thief",
  "Mediator", "Oracle", "Geomancer", "Lancer", "Samurai", "Ninja", "Calculator", "Dancer", "Bard", "Mime",
  "Chocobo", "Black Chocobo", "Red Chocobo", "Goblin", "Black Goblin", "Gobbledeguck", "Bomb", "Grenade", "Explosive", "Red Panther",
  "Coeurl", "Vampire", "Pisco Demon", "Squidraken", "Mindflayer", "Skeleton", "Draugr", "Reaper", "Ghoul", "Ghost",
  "Revenant", "Floating Eye", "Ahriman", "Plague", "Juravis", "Iron Hawk", "Cockatrice", "Swine", "Porky", "Wild Boar",
  "Dryad", "Treant", "Taiju", "Bull Demon", "Minotaur", "Sekhret", "Malboro", "Ochu", "Great Malboro", "Behemoth",
  "King Behemoth", "Dark Behemoth", "Dragon", "Blue Dragon", "Red Dragon", "Wyvern", "Hydra", "Tiamat", "Archaic Demon", "Ultima Demon",
  "Apanda", "Steel Giant", "Byblos", "Holy Dragon", "Serpentarius",
];
const gendered = [
    "Squire", "Chemist", "Knight", "Archer", "Monk", "Priest", "Wizard", "Time Mage", "Summoner", "Thief",
    "Mediator", "Oracle", "Geomancer", "Lancer", "Samurai", "Ninja", "Calculator", "Mime",
];
const humans = [
    "Squire", "Chemist", "Knight", "Archer", "Monk", "Priest", "Wizard", "Time Mage", "Summoner", "Thief",
    "Mediator", "Oracle", "Geomancer", "Lancer", "Samurai", "Ninja", "Calculator", "Dancer", "Bard", "Mime",
];
const elites = ["Byblos", "Dark Behemoth", "Holy Dragon", "Red Chocobo", "Serpentarius", "Steel Giant", "Tiamat", "Ultima Demon"];
const strongs = ["Apanda", "Archaic Demon", "Blue Dragon", "Dragon", "Hydra", "King Behemoth", "Red Dragon", "Sekhret"];
const seasons = {
    1: 1,
    2: 616,
    3: 1216,
    4: 1928,
    5: 2755,
    6: 3521,
    7: 4225,
    8: 4944,
    9: 5739,
    10: 6544,
    11: 7419,
    12: 8541,
    13: 9559,
    14: 9999999, // must exist to define (inferred) end of prior season
};

window.onload = () => {
    new Vue({
        el: "#app",
        async created() {
            this.rawData = await (await fetch("dataslug.json", {cache: "no-store"})).json();
            this.rawData.sort((a, b) => a.count != b.count ? (a.count > b.count ? -1 : 1) : (a.name < b.name) ? -1 : 1);
            this.loading = 0;
        },
        data() {
            return {
                loading: 1,
                columnMode: 'default',
                columnOptions: [
                    {text: "Default", value: 'default'},
                    {text: "Gendered humans", value: 'gender'},
                    {text: "Monsters", value: 'monster'},
                ],
                displayMode: 'default',
                displayOptions: [
                    {text: "Default", value: 'default'},
                    {text: "Gendered", value: 'gender'},
                    {text: "# Champs", value: 'times'},
                    {text: "Max Streak", value: 'streak'},
                ],
                seasonMode: 0,
                seasonOptions: [
                    {text: "All-time", value: 0},
                    {text: "Season 1", value: 1},
                    {text: "Season 2", value: 2},
                    {text: "Season 3", value: 3},
                    {text: "Season 4", value: 4},
                    {text: "Season 5", value: 5},
                    {text: "Season 6", value: 6},
                    {text: "Season 7", value: 7},
                    {text: "Season 8", value: 8},
                    {text: "Season 9", value: 9},
                    {text: "Season 10", value: 10},
                    {text: "Season 11", value: 11},
                    {text: "Season 12", value: 12},
                    {text: "Season 13", value: 13},
                ],
                rawData: [],
            };
        },
        computed: {
            seasonFilteredData() {
                if (this.seasonMode < 1 || this.seasonMode > Object.keys(seasons).length) {
                    return this.rawData.filter(x => x.count >= 20);
                } else {
                    let minChampId = seasons[this.seasonMode];
                    let maxChampId = seasons[this.seasonMode + 1] - 1;
                    return this.rawData.map(x => {
                        const ret = {};
                        ret.name = x.name;
                        ret.count = 0;
                        classes.forEach(c => {
                            ret[c] = x[c].filter(y => minChampId <= y[0] && y[0] <= maxChampId);
                            if (ret[c].length > 0) {
                                ret.count++;
                            }
                        });
                        return ret;
                    }).filter(x => x.count >= 5 || (x.count >= 1 && this.seasonMode == 13)).sort((a, b) => a.count != b.count ? (a.count > b.count ? -1 : 1) : (a.name < b.name) ? -1 : 1);
                }
            },
            mostRecentChamp() {
                let mostRecent = 0;
                for (const player of this.rawData) {
                    for (const obj of Object.values(player)) {
                        if (Array.isArray(obj)) {
                            for (const champ of obj) {
                                mostRecent = Math.max(mostRecent, champ[0]);
                            }
                        }
                    }
                }
                return mostRecent;
            },
            tableData() {
                if (this.columnMode == 'default') {
                    return this.seasonFilteredData;
                } else if (this.columnMode == 'gender') {
                    const data = [];
                    return this.seasonFilteredData.map(x => {
                        const entry = {name: x["name"], count: 0};
                        let count = 0;
                        Object.keys(x).forEach(y => {
                            if (humans.includes(y)) {
                                if (y == "Dancer") {
                                    entry[y + 'F'] = x[y];
                                } else if (y == "Bard") {
                                    entry[y + 'M'] = x[y];
                                } else {
                                    entry[y + 'M'] = x[y].filter(z => z[2] == "Male");
                                    entry[y + 'F'] = x[y].filter(z => z[2] == "Female");
                                }
                                if (entry[y + 'F'] && entry[y + 'F'].length > 0) {
                                    count++;
                                }
                                if (entry[y + 'M'] && entry[y + 'M'].length > 0) {
                                    count++;
                                }
                            }
                        });
                        entry["count"] = count;
                        return entry;
                    }).sort((a, b) => a.count != b.count ? (a.count > b.count ? -1 : 1) : (a.name < b.name) ? -1 : 1);
                } else if (this.columnMode == 'monster') {
                    return this.seasonFilteredData.map(x => {
                        const entry = {name: x["name"], count: 0};
                        let count = 0;
                        Object.keys(x).forEach(y => {
                            if (classes.includes(y) && !humans.includes(y)) {
                                entry[y] = x[y];
                                if (x[y].length > 0) {
                                    count++;
                                }
                            }
                        });
                        entry["count"] = count;
                        return entry;
                    }).sort((a, b) => a.count != b.count ? (a.count > b.count ? -1 : 1) : (a.name < b.name) ? -1 : 1);
                }
            },
            tableColumns() {
                return this.tableData.length > 0 ? Object.keys(this.tableData[0]).map(k => ({key: k, variant: this.variantForKey(k)})) : [];
            },
        },
        watch: {
            seasonMode(x) {
                this.$refs.seasonDropdown.hide(true);
            },
        },
        methods: {
            seasonToDisplay(x) {
                return x == 0 ? "All-time" : `Season ${x}`;
            },
            classToImage(x) {
                return `images/${x}` + (classes.indexOf(x) < 0 || classes.indexOf(x) > 19 ? "" : x == "Dancer" ? "F" : x == "Bard" ? "M" : Math.random() < 0.5 ? "F" : "M") + ".gif";
            },
            variantForKey(k) {
                return classes.indexOf(k) <= 19 ? "secondary" : elites.includes(k) ? "primary" : strongs.includes(k) ? "success" : "";
            },
            cellTooltip(data) {
                return `First champed #${data[0][0]}; ${data.length} time${data.length == 1 ? '' : 's'} total`;
            },
            genderDisplay(data) {
                if (gendered.includes(data.field.label)) {
                    const gotMale = data.unformatted.filter(x => x[2] == "Male").length > 0;
                    const gotFemale = data.unformatted.filter(x => x[2] == "Female").length > 0;
                    return gotMale && gotFemale ? "✓" : gotMale ? "♂" : gotFemale ? "♀" : "×";
                }
                return "✓";
            },
        },
    });
}
