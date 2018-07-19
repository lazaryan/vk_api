//стартовые конфигурации
let param = {
        count: 50,
        fields: 'about,bdate,career,city,contacts,country,interests,photo_100,activities,movies,music,nickname,quotes,site,status',
        search_global: 1,
        offset: 0
}
//словарь
const dictionary = {
        id: 'Идентификатор',
        first_name: 'Имя',
        last_name: 'Фамилия',
        bdate: 'Дата рождения',
        city: 'Город',
        country: 'Страна',
        mobile_phone: 'Мобильный телефон',
        home_phone: 'Домашний телефон',
        career: 'Карьера',
        interests: 'Интересы',
        about: 'О себе',
        activities: 'Деятельность',
        movies: 'Любимые фильмы',
        music: 'Любимая музыка',
        nickname: 'никнейм',
        quotes: 'любимые цитаты',
        site: 'адрес сайта',
        status: 'статус пользователя'
};

let dataPeople          = [];   //информация о людях
let idCountry           = {};   //id всех стран
let CountLoadPeoples    = 0;    //сколько людей загружено

sendRequest('database.getCountries', {need_all: 1, count: 250}, (data) =>{
        let c = data.response.items;

        c.forEach((item) => {
              idCountry[item.title] = item.id;
        });
});
/*
---------------------------------------------------
                Получение данных
--------------------------------------------------
*/
function loadPeoples(){
        //обнуляем данные поиска
        dataPeople          = [];
        CountLoadPeoples    = 0;

        sendRequest('users.search', param, (data) => {
                dataPeople = data.response.items;
                CountLoadPeoples = data.response.count;

                let block = document.getElementById('data-peoples');
                block.innerHTML = '';

                GetListPeoples(data.response.items);
        })
}

const form      = document.querySelector('#js-get_data');
const form_butt = form.querySelector('#js-get_list');

form_butt.addEventListener("click", () => {
        document.getElementById('data-info').innerHTML = '';
        param.offset = 0;

        SetData();                               //получаем все данные
        loadPeoples();                           //делаем запрос
});

function SetData(){
        let par = form.querySelectorAll('.js-list__item');
        let p = {};

        for (let i = 0; i < par.length; i++){
                let data = par[i].querySelectorAll('.js-data');

                for(let i = 0; i < data.length; i++){
                    let text = $.trim(data[i].dataset.name);
                    let value = $.trim(data[i].value);

                    p[text] = value;
                }
        }

        comleteData(p);
}

function comleteData(par){
        let keys = Object.keys(par);

        getData(par, keys);
        GetName(par, keys)
        getCountry(par);
        GetIdCity(par);
}

function getData(par, keys){
        keys.forEach((item) => {
                if(item != 'country' && item != 'city' && item.indexOf('name') == -1){
                        par[item] ? param[item] = par[item] : delete param[item];
                }
        });
}

function getCountry(par){
        if(par['country'] && idCountry[par['country']]){
                param['country'] = idCountry[par['country']];
        }else{
                delete param['country'];
        }
}

function GetName(par, keys){
        let s ='';
        keys.forEach((item) => {
                if(item.indexOf('name') !== -1 && par[item]){
                        s == '' ? s+= par[item] : s+= ' ' + par[item];
                }
        });

        (s != '') ? param['q'] = s : delete param['q'];
}
/*
---------------------------------------------------------------
                        получение списка людей
---------------------------------------------------------------
*/
function GetListPeoples(data){
        let block = document.getElementById('data-peoples');
        let html = '';

        if(data && data.length !== 0){
            for(let i = 0; i < data.length; i++){
                    html += '<div class="list-people__item js-list-people__item" id="people_'+ (+i + param.offset) +'">' +
                                    '<a class="list-people_img" href="https://vk.com/id'+ data[i].id +'" target="_blank">' +
                                            '<img src="'+ data[i].photo_100 +'" class="list-people_img-i">' +
                                    '</a> '+
                                    '<div class="list-people_info">' +
                                            '<span class="list-people__name">'+ data[i].last_name +'</span> ' +
                                            '<span class="list-people__name">'+ data[i].first_name +'</span>' +
                                            '<button class="btn btn-primary btn-sm js-add-info" onclick="GetMaxInfo(id);" id="'+ (+i + param.offset) +'">Показать больше</button>' +
                                    '</div>' +
                            '</div>';
            }
            block.innerHTML += html;

            let fin = document.querySelectorAll('.js-add-info');
            let id = fin[fin.length - 1].getAttribute('id');

            let but;
            if(but = document.getElementById('AddPeoples'))
                    but.parentNode.removeChild(but);

            if(CountLoadPeoples > (+id + 1)){
                    html = '<div class="get-peoples" id="AddPeoples">' +
                                    '<button class="btn btn-success btn-block" onclick="GetNewPeoples();">Добавить</button>' +
                            '</div>';

                    block.innerHTML += html;
            }
        }else{
            block.innerHTML = '<h2 class="lack-people">Пользователи не найдены</h2>';
        }
}

function GetNewPeoples(){
        param.offset += param.count;

        sendRequest('users.search', param, (data) =>{
                dataPeople = dataPeople.concat(data.response.items);
                CountLoadPeoples = data.response.count;

                GetListPeoples(data.response.items);
        });
}
/*
-----------------------------------------------------------------
                вывод доступоной информации
-----------------------------------------------------------------
*/
function GetMaxInfo(id){
        let data = dataPeople[id];
        let keys = Object.keys(data);

        let form = document.getElementById('data-info');
        let html = '';

        form.innerHTML = '';
        if(data['city']) data['city'] = data['city'].title;
        if(data['country'])  data['country'] = data['country'].title;
        if(data['career'])  data['career'] = data['career'].company;

        keys.forEach((item) => {
                if(data[item] && item.indexOf('photo') === -1 && dictionary[item]){
                        html += '<div class="info">' +
                                        '<div class="info_name">' +
                                                '<p class="info_name-i">' + dictionary[item] + '</p>' +
                                        '</div>' +
                                        '<div class="info_text">' +
                                                '<p class="info_name-i">' + data[item] + '</p>' +
                                        '</div>' +
                                '</div>';
                }
        });

        form.innerHTML = html;
}

/*
-----------------------------------------------------------
                поиск по городу
-----------------------------------------------------------
*/

let input_country = document.getElementById('country');
if(input_country.value){
    document.getElementById('js-city').classList.remove('_none');
}

input_country.oninput = function () {
    let text = this.value;
    let b = document.getElementById('js-city');

    if(text && b.classList.contains('_none')){
        b.classList.remove('_none');
    }else if(!text){
        b.classList.add('_none');
    }
}

function GetIdCity(par){
    if(par['country'] && idCountry[par['country']] && par['city']){
        let p = {
            country_id: idCountry[par['country']],
            q: par['city'],
            need_all: 1
        }

        sendRequest('database.getCities', p, (data) => {
            let id = GetCity(par['city'], data.response.items);
            (id !== -1)? param['city'] = id : delete param['city'];
        })
    }else if(!par['city']){
        delete param['city'];
    }
}

function GetCity(city, items){
    if(items.length == 1)
        return items[0].id;

    for(let i = 0; i < items.length; i++){
        if(city.length == items[i].title.length)
            return items[i].id;
    }

    return -1;
}
