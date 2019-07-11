let submitButton = document.querySelector('.btn');
let regButton = document.querySelector('.reg-button');
let regForm = document.querySelector('form');
let list = document.querySelector('.list-group');
let listTitle = document.querySelector('.list-title')
let countrySelect = document.querySelector('.country-select');
let stateSelect = document.querySelector('.state-select');
let citySelect = document.querySelector('.city-select');
let url = 'http://localhost:3000';
        

const renderSelectOptions = (select, id = 1) => {
    let appendSelect = (selectHTML, json) => {
        let optionsArray = [];
        json.forEach(item => {
            optionsArray.push(`<option value=${item.id}>${item.name}</option>`);
        });
        selectHTML.innerHTML += optionsArray.join();
    }
    let clearSelect = (items) => {
        items.forEach(item => {
            for (let i = item.length; i >= 1; i--) {
                item.remove(i);
            }
        })  
    } 
    if (select === 'countries') {
        fetch(`${url}/${select}`)
        .then(res => res.json())
        .then(json => {    
            appendSelect(countrySelect, json);
        });
    }
    else if (select === 'states') {
        fetch(`${url}/${select}/?country_id=${id}`)
        .then(res => res.json())
        .then(json => {
            clearSelect([stateSelect, citySelect]);    
            appendSelect(stateSelect, json);
        });
    }
    else if (select === 'cities') {
        fetch(`${url}/${select}/?state_id=${id}`)
        .then(res => res.json())
        .then(json => {    
            clearSelect([citySelect]); 
            appendSelect(citySelect, json);
        });
    }   
};


const renderUsers = () => {
    fetch(`${url}/users`)
    .then(res => res.json())
    .then(json => {
        let userList = json.map((item) => {
            let country = fetch(`${url}/countries/${item['country_id']}`)
                            .then(res => res.json())
                            .then(json => {
                                country = json.name;
                            });
            let state = fetch(`${url}/states/${item['state_id']}`)
                            .then(res => res.json())
                            .then(json => {
                                state = json.name;});
            let city = fetch(`${url}/cities/${item['city_id']}`)
                            .then(res => res.json())
                            .then(json => {
                                city = json.name;});
            let date = new Date(item.createdAt);
            let name = item.name;
            let num = item['phone_number'];
            let email = item.email;
            return Promise.all([country, state, city]).then(e => {
                return `<div class="list-group-item list-group-item-action flex-column align-items-start">
                            <div class="d-flex w-100 justify-content-between">
                                <h5>${name}</h5>
                            </div>
                            <p class="mb-1">Email: ${email}</p>
                            <p class="mb-1">Phone number: ${num}</p>
                            <p class="mb-1">Location: ${country}, ${state}, ${city}</p>
                            <small>Registered: ${date.toLocaleString().split(',')[0]}</small>
                        </div>`;
            });
        });
        Promise.all(userList).then(e => {
            list.innerHTML = e.reverse().join();  
        });
    })            
};


countrySelect.onchange = event => {    
    renderSelectOptions('states', event.target.value);
};
stateSelect.onchange = event => {
    renderSelectOptions('cities', event.target.value);
};

document.addEventListener("DOMContentLoaded", () => {
    renderUsers();
    renderSelectOptions('countries');
    clearForm(); //from firefox remembering values after page reload
        
});

regButton.addEventListener('click', (e) => {
    regForm.classList.toggle('d-none');
    regButton.classList.toggle('d-none');
    list.classList.toggle('d-none');
    listTitle.classList.toggle('d-none');
});


const clearForm = () => {
    let items = regForm.elements;
    for (let i in items) {
        if (items[i].type === 'select-one' || items[i].type === 'text' 
            || items[i].type === 'textarea' || items[i].type === 'email') {
            items[i].value = "";
        }
    }
}
  
submitButton.addEventListener('click', (e) => {
    regForm.classList.add('check-form');
});

regForm.addEventListener('submit', (e) => {
    
    let regUser = {
        "name": regForm.elements.name.value,
        "email": regForm.elements.email.value,
        "country_id": regForm.elements.country.value,
        "state_id": regForm.elements.state.value,
        "city_id": regForm.elements.city.value,
        "phone_number": regForm.elements.phoneNum.value,
        "address": regForm.elements.address.value,
        "about_me": regForm.elements.about.value
    };
    for (let i in regUser) {
        if (regUser[i] === '') {
            regUser[i] = null;
        }
    }
    
    fetch('http://localhost:3000/users', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(regUser),
      })
    .then(res => {
        clearForm();
        renderUsers();
        regForm.classList.toggle('d-none');
        regButton.classList.toggle('d-none');
        list.classList.toggle('d-none');
        listTitle.classList.toggle('d-none');
        regForm.classList.remove('check-form');
    })
    .catch(error => console.error(error));
    e.preventDefault();
});





           
