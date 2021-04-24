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

window.onload = () => {
    new Vue({
        el: "#app",
        async created() {
            this.tableData = await (await fetch("dataslug.json", {cache: "no-store"})).json();
            this.tableData.sort((a, b) => a.count != b.count ? (a.count > b.count ? -1 : 1) : (a.name < b.name) ? -1 : 1);
            this.tableColumns = Object.keys(this.tableData[0]).map(k => ({key: k, variant: this.variantForKey(k)}));
            this.loading = 0;
        },
        data() {
            return {
                loading: 1,
                displayMode: 'default',
                displayOptions: [
                    {text: "Default", value: 'default'},
                    {text: "Gendered", value: 'gender'},
                    {text: "# Champs", value: 'times'},
                    {text: "Max Streak", value: 'streak'},
                ],
                tableData: [], 
                tableColumns: [], 
            }
        },
        methods: {
            classToImage(x) {
                return `images/${x}` + (classes.indexOf(x) > 19 ? "" : x == "Dancer" ? "F" : x == "Bard" ? "M" : Math.random() < 0.5 ? "F" : "M") + ".gif";
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
