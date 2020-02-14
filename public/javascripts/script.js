document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
	},
	false,
);

function menuToggle() {
	const navbarMobile = document.querySelector('header .nav-mobile');
	console.log('test', navbarMobile);
	navbarMobile.classList.toggle('visible');
}

function addToFavorites(id) {
	axios
		.post('/user/addFavourites', { id })
		.then((response) => {
			console.log(response);
		})
		.catch((err) => console.log(err));
}

document.querySelectorAll('.favorites').forEach((elem) => {
	elem.onclick = (event) => {
		console.log(event.target.id);
		addToFavorites(event.target.id);
	};
});
function deleteCategory(parentNode, childToDelete) {
	// console.log('category', category);
	const Node = document.querySelector(`.tech-stack`);
	// console.log(Node, childToDelete);
	// const childToDelete = document.querySelector(category);
	axios.post('/user/deleteStack', { category: childToDelete.id });
	console.log(childToDelete.id);
	parentNode.removeChild(childToDelete);
}

function addCategory() {
	const categoryElement = document.querySelector('#category-name');
	const rateElement = document.querySelector('#category-rate');

	const Node = document.querySelector(`.tech-stack`);
	const newStack = document.createElement('div');

	newStack.innerHTML = `<div class="item {{category}}" id="{{category}}"> ${categoryElement.value}: ${rateElement.value} / 5  <img src="/images/close-btn-dark.svg" class="killer">`;

	Node.appendChild(newStack);
	axios.post('/user/addStack', {
		category: categoryElement.value,
		rate: rateElement.value,
	});
	categoryElement.value = '';
	rateElement.value = '';
}

document.querySelectorAll('.killer').forEach((elem) => {
	elem.onclick = function(event) {
		// event.target;
		// console.log(event.target.parentNode.className);
		deleteCategory(event.target.parentNode.parentNode, event.target.parentNode);
	};
});

document.querySelector('#addToStack').onclick = (event) => {
	console.log('clicked');
	addCategory();
};
