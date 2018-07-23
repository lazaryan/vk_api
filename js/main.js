'use strict';

//стартовые конфигурации
var param = {
        count: 50,
        fields: 'about,bdate,career,city,contacts,country,interests,photo_100,activities,movies,music,nickname,quotes,site,status',
        search_global: 1,
        offset: 0
        //словарь
};var dictionary = {
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

var dataPeople = [],
    idCountry = {},
    CountLoadPeoples = 0;


sendRequest('database.getCountries', { need_all: 1, count: 250 }, function (data) {
        var c = data.response.items;

        c.forEach(function (item) {
                idCountry[item.title] = item.id;
        });
});
/*
---------------------------------------------------
                Получение данных
--------------------------------------------------
*/
function loadPeoples() {
        sendRequest('users.search', param, function (data) {
                if (CountLoadPeoples === 0 || data.response.count === 0 || CountLoadPeoples !== data.response.count) {
                        dataPeople = data.response.items;
                        CountLoadPeoples = data.response.count;

                        var block = document.getElementById('data-peoples');
                        block.innerHTML = '';

                        GetListPeoples(data.response.items);
                } else {
                        loadPeoples();
                }
        });
}

var form = document.querySelector('#js-get_data');
var form_butt = form.querySelector('#js-get_list');

form_butt.addEventListener("click", function () {
        document.getElementById('data-info').innerHTML = '';
        param.offset = 0;

        SetData(); //получаем все данные
        loadPeoples(); //делаем запрос
});

function SetData() {
        var par = form.querySelectorAll('.js-list__item');
        var p = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
                for (var _iterator = par[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _param = _step.value;

                        var data = _param.querySelectorAll('.js-data');

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                                for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                        var info = _step2.value;

                                        p[$.trim(info.dataset.name)] = $.trim(info.value);
                                }
                        } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                        } finally {
                                try {
                                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                _iterator2.return();
                                        }
                                } finally {
                                        if (_didIteratorError2) {
                                                throw _iteratorError2;
                                        }
                                }
                        }
                }
        } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
        } finally {
                try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                        }
                } finally {
                        if (_didIteratorError) {
                                throw _iteratorError;
                        }
                }
        }

        comleteData(p);
}

function comleteData(par) {
        var keys = Object.keys(par);

        getCountry(par);
        GetIdCity(par);
        getData(par, keys);
        GetName(par, keys);
}

function getData(par, keys) {
        keys.forEach(function (item) {
                item != 'country' && item != 'city' && item.indexOf('name') == -1 ? par[item] ? param[item] = par[item] : delete param[item] : '';
        });
}

function getCountry(par) {
        par['country'] && idCountry[par['country']] ? param['country'] = idCountry[par['country']] : delete param['country'];
}

function GetName(par, keys) {
        var s = '';
        keys.forEach(function (item) {
                item.indexOf('name') !== -1 && par[item] ? s == '' ? s += par[item] : s += ' ' + par[item] : '';
        });

        s != '' ? param['q'] = s : delete param['q'];
}
/*
---------------------------------------------------------------
                        получение списка людей
---------------------------------------------------------------
*/
function GetListPeoples(data) {
        var block = document.getElementById('data-peoples');
        var html = '';

        if (data && data.length !== 0) {
                for (var i = 0; i < data.length; i++) {
                        html += '<div class="list-people__item ' + (i % 2 == 0 ? 'list-people__item_left' : 'list-people__item_right') + ' js-list-people__item" id="people_' + (+i + param.offset) + '">\n                                        <a class="list-people__item_img" href="https://vk.com/id' + data[i].id + '" target="_blank">\n                                                <img src="' + data[i].photo_100 + '" class="list-people__item_img-i">\n                                        </a>\n                                        <div class="list-people__item_info">\n                                             <p class="list-people__item_name">' + data[i].last_name + ' ' + data[i].first_name + '</p>\n                                        </div>\n                                        <button class="btn btn-primary btn-sm list-people__item_bth js-add-info" onclick="GetMaxInfo(id);" id="' + (+i + param.offset) + '">\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435</button>\n                                </div>';
                }
                block.innerHTML += html;

                var fin = document.querySelectorAll('.js-add-info');
                var id = fin[fin.length - 1].getAttribute('id');

                var but = void 0;
                if (but = document.getElementById('AddPeoples')) but.parentNode.removeChild(but);

                if (CountLoadPeoples > +id + 1) {
                        html = '<div class="get-peoples" id="AddPeoples">\n                                    <button class="btn btn-success btn-block" onclick="GetNewPeoples();">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C</button>\n                            </div>';

                        block.innerHTML += html;
                }
        } else {
                block.innerHTML = '<h2 class="lack-people">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</h2>';
        }
}

function GetNewPeoples() {
        param.offset += param.count;

        sendRequest('users.search', param, function (data) {
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
function GetMaxInfo(id) {
        var data = dataPeople[id];
        var keys = Object.keys(data);

        var form = document.getElementById('data-info');
        var html = '';

        if (data['city']) data['city'] = data['city'].title;
        if (data['country']) data['country'] = data['country'].title;
        if (data['career']) data['career'] = data['career'].company;

        html += '<table class="info">';

        keys.forEach(function (item) {
                if (data[item] && item.indexOf('photo') === -1 && dictionary[item]) {
                        html += '<tr class="info__item">\n                                        <th class="info_name">\n                                                ' + dictionary[item] + '\n                                        </th>\n                                        <th class="info_text">\n                                                ' + data[item] + '\n                                        </th>\n                                </tr>';
                }
        });

        html += '</table>';

        form.innerHTML = html;
}

/*
-----------------------------------------------------------
                поиск по городу
-----------------------------------------------------------
*/

var input_country = document.getElementById('country');
if (input_country.value) {
        document.getElementById('js-city').classList.remove('_none');
}

input_country.oninput = function () {
        var text = undefined.value;
        var b = document.getElementById('js-city');

        text && b.classList.contains('_none') ? b.classList.remove('_none') : !text ? b.classList.add('_none') : '';
};

function GetIdCity(par) {
        if (par['country'] && idCountry[par['country']] && par['city']) {
                var p = {
                        country_id: idCountry[par['country']],
                        q: par['city'],
                        need_all: 1
                };

                sendRequest('database.getCities', p, function (data) {
                        var id = GetCity(par['city'], data.response.items);
                        id !== -1 ? param['city'] = id : delete param['city'];
                });
        } else if (!par['city']) {
                delete param['city'];
        }
}

function GetCity(city, items) {
        if (items.length == 1) return items[0].id;

        for (var i = 0; i < items.length; i++) {
                if (city.length == items[i].title.length) return items[i].id;
        }return -1;
}