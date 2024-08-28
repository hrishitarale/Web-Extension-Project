
document.addEventListener('DOMContentLoaded', init, false);

let data, table, sortCol, temp;
let sortAsc = false;
let pageSize = 5;
let curPage = 1;

async function init() {
	checkToken();
	// Select the table (well, tbody)
	table = document.querySelector('#catTable tbody');
	getDashboardData();
	// listen for sort clicks
	document.querySelectorAll('#catTable thead tr th').forEach(t => {
		t.addEventListener('click', sort, false);
	});

	document.querySelector('#nextButton').addEventListener('click', nextPage, false);
	document.querySelector('#prevButton').addEventListener('click', previousPage, false);
}

function checkToken() {
	const theURL = window?.location?.href;
	const token = localStorage.getItem('adminToken');
	if (token === null || token === undefined) {
		window?.location.assign(theURL.replace(window?.location?.pathname, "/web-Ui/admin-panel/admin-login/login.html"));
	}
}

let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

menuicn.addEventListener("click", () => {
	nav.classList.toggle("navclose");
})


function getDashboardData() {
	Url = 'http://localhost:1107/admin/getusers';
	methodGET(Url).then(res => {
		// Process the response res here 
		// Example: Logging the res to the console 
		if (res?.status === 'SUCCESS') {
			data = res?.data;
			// console.log(res);
			setDashboardData(res?.data);
			renderTable();
		}
	}).catch(error => {
		// Handle any errors here 
		console.error(error); // Example: Logging the error to the console 
		if (error?.status !== 'SUCCESS') {
			// alert(error?.message);
		}
	});
}

function setDashboardData(data) {
	temp = data;
	const totalUser = document.getElementById('totalUser');
	totalUser.innerText = (data !== undefined && data.length > 0) ? data.length : 0;

	const dWords = document.getElementById("dWords");
	const tSentence = document.getElementById("tSentence");
	if (data !== undefined && data.length > 0) {
		let searchKeyWords = 0;
		let transalateTexts = 0;
		data.map((d) => {
			// console.log(d);
			if (d?.searchKeyWords !== undefined) {
				searchKeyWords += (d?.searchKeyWords.length > 0) ? d?.searchKeyWords.length : 0;
			}

			if (d?.transalateTexts !== undefined) {
				transalateTexts += (d?.transalateTexts.length > 0) ? d?.transalateTexts.length : 0;
			}
		});
		dWords.innerText = searchKeyWords;
		tSentence.innerText = transalateTexts;
	}

}

let downloadExcel;
function renderTable() {
	// create html
	let result = '';
	data.filter((row, index) => {
		let start = (curPage - 1) * pageSize;
		let end = curPage * pageSize;
		if (index >= start && index < end) return true;
	}).forEach((c, i) => {
		result += `<tr>
		<td>${i + 1}</td>
     <td>${c.username}</td>
     <td>${c.email}</td>
     <td>${c.phone}</td>
     <td id="downloadExcel" ><i id="${c._id}" class="fas fa-cloud-download-alt fa-lg"></i></td>
     </tr>`;
	});
	table.innerHTML = result;

	downloadExcel = document.getElementById('downloadExcel');
	document.querySelectorAll('#downloadExcel i').forEach(t => {
		t.addEventListener('click', getHistory, true);
	});
}

function sort(e) {
	// console.log(e?.target?.dataset.sort);
	let thisSort = e?.target?.dataset.sort;
	if (sortCol === thisSort) sortAsc = !sortAsc;
	sortCol = thisSort;
	// console.log('sort dir is ', sortAsc);
	data.sort((a, b) => {
		if (a[sortCol] < b[sortCol]) return sortAsc ? 1 : -1;
		if (a[sortCol] > b[sortCol]) return sortAsc ? -1 : 1;
		return 0;
	});
	renderTable();
}

function previousPage() {
	// console.log('aaa');
	if (curPage > 1) curPage--;
	renderTable();
}

function nextPage() {
	if ((curPage * pageSize) < data.length) curPage++;
	renderTable();
}

async function getHistory(e) {
	// console.log('aaa', e, e?.target?.id);
	const user = data.find(item => item._id === e?.target?.id);
	// console.log(user);
	if (user !== undefined && user?._id === e?.target?.id) {
		Url = `http://localhost:1107/admin/excel?id=${e?.target?.id}`;
		methodGET_II(Url).then(d => {
			const fileName = `${user?.username.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')}_(${user?.username}-History)-(${new Date().toDateString()}, ${new Date().toLocaleTimeString()})`
			downLoadFile(d, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName);
		}).catch(error => console.error('Error fetching data:', error));
	}
};

function downLoadFile(res, type, fileName) {
	const url = window?.URL.createObjectURL(new Blob([res]), {
		type: type
	});
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', `${fileName}_data.xlsx`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}


const logout = document.getElementById('signOut');
logout.addEventListener('click', () => {
	localStorage.clear();
	checkToken();
});

const searchNav = document.getElementById('searchBox_I');
searchNav.addEventListener('keyup', (inBoxData) => {
	getSearchData(inBoxData?.target?.value.toLowerCase(), temp);
});
const searchBody = document.getElementById('searchBox_II');
searchBody.addEventListener('keyup', (inBoxData) => {
	getSearchData(inBoxData?.target?.value.toLowerCase(), temp);
});

function getSearchData(name, Data) {
	if (name !== undefined && name !== '') {
		const tempLow = Data.filter(e => {
			if (e?.username !== undefined && e?.username !== '' && e?.username.toLowerCase().includes(name)) {
				return e;
			}
		});
		data = tempLow;
	}
	else {
		data = temp;
	}

	renderTable();
}

const customSelect = document.querySelector(".custom-select");
const selectBtn = document.querySelector(".select-button");

const selectedValue = document.querySelector(".selected-value");
const optionsList = document.querySelectorAll(".select-dropdown li");

// add click event to select button
selectBtn.addEventListener("click", () => {
	// add/remove active class on the container element
	customSelect?.classList.toggle("active");
	// update the aria-expanded attribute based on the current state
	selectBtn.setAttribute(
		"aria-expanded",
		selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
	);
});

optionsList.forEach((option) => {
	function handler(e) {
		// Click Events
		if (e?.type === "click" && e?.clientX !== 0 && e?.clientY !== 0) {
			selectedValue.textContent = this.children[1]?.textContent;
			customSelect?.classList.remove("active");
		}
		// Key Events
		if (e?.key === "Enter") {
			selectedValue.textContent = this.textContent;
			customSelect?.classList.remove("active");
		}
		if (e?.target !== undefined && e?.target?.innerText !== undefined && e?.target?.innerText !== "") {
			curPage = 1;
			pageSize = e?.target?.innerText;
			renderTable();
		}
	}

	option.addEventListener("keyup", handler);
	option.addEventListener("click", handler);
});