/*
 *  - add selectors for different views (seasonal, value display)
 *  - persistently selectable rows
 *  - handle direct GET links
 *  - get link to current view
 */

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
const elites = ["Red Chocobo", "Dark Behemoth", "Tiamat", "Ultima Demon", "Steel Giant", "Byblos", "Holy Dragon", "Serpentarius"];
const strongs = ["Sekhret", "King Behemoth", "Dragon", "Blue Dragon", "Red Dragon", "Hydra", "Archaic Demon", "Apanda"];
const data = [];

function generateGender(c) {
    const i = classes.indexOf(c);
    if (i < 0 || i > 19) {
        return '';
    }
    if (c == 'Dancer') {
        return 'F';
    }
    if (c == 'Bard') {
        return 'M';
    }
    return Math.random() < 0.5 ? 'M' : 'F';
}

function getClassType(c) {
    const i = classes.indexOf(c);
    if (0 <= i && i <= 19) {
        return 'human';
    }
    if (elites.includes(c)) {
        return 'elite';
    }
    if (strongs.includes(c)) {
        return 'strong';
    }
    return 'common';
}

const champComparator = (a, b) => {
    if (a.count != b.count) {
        return b.count - a.count;
    }
    let mostRecentA = 0, mostRecentB = 0;
    for (const c of Object.keys(a)) {
        if (c == 'name' || c == 'count') {
            continue;
        }
        if (a[c].length > 0) {
            mostRecentA = Math.max(mostRecentA, a[c][0][0]);
        }
    }
    for (const c of Object.keys(b)) {
        if (c == 'name' || c == 'count') {
            continue;
        }
        if (b[c].length > 0) {
            mostRecentB = Math.max(mostRecentB, b[c][0][0]);
        }
    }
    return mostRecentA - mostRecentB;
};

const generateHeaderHtml = (displayClasses) => {
    const html = [];
    html.push('<tr>');
    html.push('<th>Name</th>');
    html.push('<th>#</th>');
    for (const c of displayClasses) {
        html.push(`<th class="${getClassType(c)}"><img src="images/${c}${generateGender(c)}.gif"></th>`);
    }
    html.push('</tr>');
    return html.join('');
}

const renderTable = (column) => {
    const html = [];

    const displayClasses = column == 'monsters' ? classes.slice(20) : classes;
    // TODO: handle 'gendered'
    // TODO: fix sorting for non-default views

    html.push('<table>');

    // table header/footer
    const headerHtml = generateHeaderHtml(displayClasses);
    html.push('<thead>');
    html.push(headerHtml);
    html.push('</thead>');
    html.push('<tfoot>');
    html.push(headerHtml);
    html.push('</tfoot>');

    // table body
    html.push('<tbody>');
    for (const row of data) {
        html.push('<tr>');
        html.push(`<th><a href="champthings.html?user=${row.name}">${row.name}</a></th>`);
        let count = 0;
        for (const c of displayClasses) {
            if (c in row && row[c].length > 0) {
                count++;
            }
        }
        html.push(`<td>${count}</td>`);
        for (const c of displayClasses) {
            if (c in row) {
                html.push(`<td class="${getClassType(c)} ${row[c].length ? 'have' : 'missing'}">`);
                html.push(`${row[c].length ? row[c].length : '×'}`);
                html.push(`</td>`);
            } else {
                html.push(`<td class="missing">×</td>`);
            }
        }
        html.push('</tr>');
    }
    html.push('</tbody>');
    html.push('</table>');

    document.getElementById('tableOutput').innerHTML = html.join('');
};

/** Retrieves the largest champ ID present in the data, for the "latest champ" status indicator */
const getMaxChampId = () => {
    let maxChampId = 0;
    for (const row of data) {
        for (const c of classes) {
            if (c in row) {
                maxChampId = Math.max(maxChampId, ...row[c].map(x => x[0]));
            }
        }
    }
    return maxChampId;
};

/** Refreshes the leaderboard table when select column display changes */
const columnChange = (selectObject) => {
    const column = selectObject.value;
    renderTable(column);
};

/** Constructs the menu line above the leaderboard table */
const renderMenu = () => {
    const html = [];

    html.push(`As of champ #<b>${getMaxChampId()}</b> &mdash; `);

    html.push('<label for="columnSelect">Columns:</label> ');
    html.push('<select onchange="columnChange(this)" name="columnSelect" id="columnSelect">');
    html.push('<option value="default">Default</option>');
    html.push('<option value="gendered" disabled>Gendered</option>');
    html.push('<option value="monsters">Monsters</option>');
    html.push('</select>');
    document.getElementById('menuOutput').innerHTML = html.join('');
};

window.onload = async () => {
    const loadedData = await (await fetch("dataslug.json", {cache: "no-cache"})).json();
    loadedData.sort(champComparator);
    data.push(...loadedData);
    renderMenu();
    renderTable('default');
};
