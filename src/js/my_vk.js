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

        params['access_token'] = 'ab5c5b975ae43c51794a0b2617312d515b24526a76e2be632924adbfedd0ff7f837431c4007d395c27937';

        return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}
