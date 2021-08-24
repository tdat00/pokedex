/*
This script will parse Type Chart of Serebii to JSON object.
Ref: https://www.serebii.net/games/typexy.shtml
*/

fnNormalizeImgSource = function(src) {
    return src.replace("/games/type/", "").replace("/pokedex-bw/type/", "").replace("2.gif", "").replace(".gif", "");
};
fnGetTypes = function(cell) {
    return Array.from(cell.getElementsByTagName("img")).map(img => fnNormalizeImgSource(img?.getAttribute("src"))).filter(x => x != undefined);
};
fnGetValue = function(cell) {
    value = cell.getElementsByTagName("img")[0]?.getAttribute("alt");
    switch (value) {
        case undefined:
            return "";
        case null:
            return "";
        case "*0 Damage":
            return "0";
        case "*0.25 Damage":
            return "0.25";
        case "*0.5 Damage":
            return "0.5";
        case "*2 Damage":
            return "2";
        case "*4 Damage":
            return "4";
        default:
            console.error("Unknow value: " + value);
            return value;
    }
};

rows = document.getElementsByTagName("table")[4].rows;
attack_types = Array.from(rows[0].cells).map(cell => fnGetTypes(cell)[0]).filter(x => x != undefined);
data = [];
for (let i = 1; i < rows.length; i++) {
    cells = Array.from(rows[i].cells);
    types = fnGetTypes(cells[0]);
    values = cells.slice(1).map(cell => fnGetValue(cell));

    data.push({types, values});
};

console.log(attack_types);
console.log(data);
