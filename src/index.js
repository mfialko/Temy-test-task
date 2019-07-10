let submitButton = document.querySelector('.button');
let filterForm = document.querySelector('form');
let list = document.querySelector('.list');
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

const getItemById = (item, id) => {
    let name;
    fetch(`${url}/${item}/?id=${id}`)
    .then(res => res.json())
    .then(json => {
        name = json.name;
    });
    return name;
}

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
                return `<li>Name:${name}</li>
                        <li>Email: ${email}</li>
                        <li>Phone number: ${num}</li>
                        <li>Location: ${country}, ${state}, ${city}</li>
                        <li>Registered: ${date.toLocaleString().split(',')[0]}</li>
                        `;
            });
        });
        Promise.all(userList).then(e => {
            list.innerHTML = e.join();  
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
});

filterForm.addEventListener('submit', (e) => {
    let regUser = {
        "name": filterForm.elements.name.value,
        "email": filterForm.elements.email.value,
        "country_id": filterForm.elements.country.value,
        "state_id": filterForm.elements.state.value,
        "city_id": filterForm.elements.city.value,
        "phone_number": filterForm.elements.phoneNum.value,
        "address": filterForm.elements.address.value,
        "about_me": filterForm.elements.about.value
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
      .then(res => res.json())
      .then(json => {
        document.location.reload();
      })
      .catch(error => console.error(error));
    e.preventDefault();
});





           
