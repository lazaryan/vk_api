function sendRequest(method, params, func){
        $.ajax({
                url: GetURL(method, params),
                method: 'GET',
                dataType: 'JSONP',
                success: func
        });
}

function GetURL(method, params){
        if(!method) throw new Error('method not passed');
        params = params || {};

        params['access_token'] = '425961bd10ef3c97d2c145e77e9b0e8ce5be4e992045b65d07dc292ee7e6008201ae44ff74f2720977d06';

        return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}
