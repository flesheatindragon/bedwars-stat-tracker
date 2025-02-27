
/**
ISSUES:

Chart resets itself
*/

// Shift chart
function shift(number, chartObj) {
	for (let i = 0; i < number; i += 1) {
		chartObj.a = chartObj.b;
		chartObj.b = chartObj.c;
		chartObj.c = chartObj.d;
		chartObj.d = chartObj.e;
		chartObj.e = chartObj.f;
		chartObj.f = chartObj.g;
		chartObj.g = 0;
	}
	return chartObj;
}

// Setup for new users
if (parseInt(localStorage.getItem('games')) == null || parseInt(localStorage.getItem('games')) == 'null' || isNaN(parseInt(localStorage.getItem('games')))) {
	localStorage.setItem('games', 0);
	const days = {
		a: 0,
		b: 0,
		c: 0,
		d: 0,
		e: 0,
		f: 0,
		g: 0
	};
	localStorage.setItem('days', JSON.stringify(days));
	const date = new Date();
	const lastUse = {
		d: date.getDate(),
		m: date.getMonth(),
		y: date.getYear()
	};
	localStorage.setItem('lastUse', JSON.stringify(lastUse));
}

// Create array of games
const games = [];
for (let i = 0; i < parseInt(localStorage.getItem('games')); i += 1) {
	games.push(JSON.parse(localStorage.getItem(i + 1)));
}

// Setup data
let totalkills = 0;
let totalfinalkills = 0;
let totalwins = 0;
let totalbeds = 0;
let winrate;
let days = JSON.parse(localStorage.getItem('days'));
const date = new Date();

// Checks if it's a new day
const newUse = {
	d: date.getDate(),
	m: date.getMonth(),
	y: date.getYear()
};
const lastUse = JSON.parse(localStorage.getItem('lastUse'));
if (newUse.y - lastUse.y > 1 || newUse.m - lastUse.m > 1) {
	days = shift(14, days);  // Reset days variable
}
if (newUse.y - lastUse.y == 1) {
	if (lastUse.m == 11) {
		const daysDifferenceAllowed = 7 - newUse.d;
		if (daysDifferenceAllowed > 0) {
			const finalChartDay = 31 - daysDifferenceAllowed;
			days = shift(7 - (lastUse.d - finalChartDay), days);
		}
	}
}
if (newUse.m - lastUse.m == 1) {
	const lastMonthLength = new Date(newUse.y, newUse.m, 0).getDate();
	const daysDifferenceAllowed = 7 - newUse.d;
	if (daysDifferenceAllowed > 0) {
		const finalChartDay = lastMonthLength - daysDifferenceAllowed;
		days = shift(7 - (lastUse.d - finalChartDay), days);
	}
}
if (newUse.y == lastUse.y && newUse.m == lastUse.m)
	days = shift(newUse.d - lastUse.d, days);

for (let e = 0; e < games.length; e += 1) {
	totalkills += parseInt(games[e].kills);
	totalfinalkills += parseInt(games[e].finalkills);
	totalwins += parseInt(games[e].win);
	totalbeds += parseInt(games[e].beds);
}
winrate = totalwins / parseInt(localStorage.getItem('games'));
winrate = Math.trunc(winrate * Math.pow(10, 2)) / Math.pow(10, 2);  // Truncates winrate

// Update UI
document.getElementById('totalkills').innerText = totalkills;
document.getElementById('totalfinalkills').innerText = totalfinalkills;
document.getElementById('totalwins').innerText = totalwins;
document.getElementById('totalbeds').innerText = totalbeds;
document.getElementById('winrate').innerText = winrate;
document.getElementById('score').innerText = days.g;

// Update chart
const bars = [];
for (let i = 0; i < 7; i += 1) {
	bars.push(document.getElementById('chart' + (i + 1)));
}
bars[0].style.height = ((days.a * 0.8) + 5) + 'px';
bars[1].style.height = ((days.b * 0.8) + 5) + 'px';
bars[2].style.height = ((days.c * 0.8) + 5) + 'px';
bars[3].style.height = ((days.d * 0.8) + 5) + 'px';
bars[4].style.height = ((days.e * 0.8) + 5) + 'px';
bars[5].style.height = ((days.f * 0.8) + 5) + 'px';
bars[6].style.height = ((days.g * 0.8) + 5) + 'px';

// Add a new game
function addGame() {
	const game = {
		kills: parseInt(document.getElementById('kills').value),
		finalkills: parseInt(document.getElementById('finalkills').value),
		win: parseInt(document.getElementById('won').value),
		beds: parseInt(document.getElementById('beds').value)
	};
	localStorage.setItem(parseInt(localStorage.getItem('games')) + 1, JSON.stringify(game));
	localStorage.setItem('games', parseInt(localStorage.getItem('games')) + 1);
	// Update score
	days.g += (game.kills + (game.finalkills * 3) + (game.beds * 5) + (game.win * 7));
	localStorage.setItem('days', JSON.stringify(days));
	window.location = '';
}

// Update date
function saveDate() {
	const date = new Date();
	const lastUse = {
		d: date.getDate(),
		m: date.getMonth(),
		y: date.getYear()
	};
	localStorage.setItem('lastUse', JSON.stringify(lastUse));
	setTimeout('saveDate()', 50);
}
saveDate();