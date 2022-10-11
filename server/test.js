const test = new Date((Date.now() - new Date(new Date().setFullYear(2021, 10, 2)).getTime())).getFullYear()

const thisWeek = new Date().setDate(new Date().getDate() - new Date().getDay());

const d = new Date().setMonth(8);
const today = new Date().setHours(0,0,0,0);
const lastDay = new Date(d).setHours(0,0,0,0);
const oneDay = 1000 * 60* 60* 24;

console.log((today - lastDay)/oneDay);

console.log(new Date(new Date(thisWeek).setHours(0, 0, 0, 0)));