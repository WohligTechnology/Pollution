//var adminurl = "http://localhost:1337/";
//var adminurl = "http://timesbappa.com:1337/";
var adminurl = "http://timesbappa.com/";
//var adminurl = "http://192.168.2.5/";
//var adminurl = "http://104.197.95.70/";
//var adminurl = "http://192.168.2.22/";
var adminlogin = {
    "username": "wohlig@wohlig.com",
    "password": "wohlig123"
};
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function ($http) {
    var navigation = [{
            name: "Dashboard",
            classis: "active",
            link: "#/home",
            subnav: []
        }, {
            name: 'User',
            active: '',
            link: '#/user',
            subnav: []
        }, {
            name: 'Leaderboard',
            active: '',
            link: '#/leaderboard',
            subnav: []
        }
//        {
//            name: 'Images',
//            active: '',
//            link: '#/images',
//            subnav: []
//        }, {
//            name: 'ImageType',
//            active: '',
//            link: '#/imagetype',
//            subnav: []
//        }, {
//            name: 'Result',
//            active: '',
//            link: '#/result',
//            subnav: []
//        }, 
                      //Add New Left
    ];

    return {
        makeactive: function (menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        getnav: function () {
            return navigation;
        },
        adminLogin: function (data, callback) {
            $http({
                url: adminurl + "user/adminlogin",
                method: "POST",
                data: {
                    "email": data.email,
                    "password": data.password
                }
            }).success(callback);
        },
        countUser: function (callback) {
            $http.get(adminurl + "user/countusers").success(callback);
        },
        setUser: function (data) {
            $.jStorage.set("user", data);
        },
        getUser: function () {
            $.jStorage.get("user");
        },
        getOneUser: function (id, callback) {
            $http({
                url: adminurl + 'user/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedUser: function (user, callback) {
            $http({
                url: adminurl + 'user/findlimited',
                method: 'POST',
                data: {
                    'search': user.search,
                    'pagesize': parseInt(user.limit),
                    'pagenumber': parseInt(user.page)
                }
            }).success(callback);
        },
        deleteUser: function (callback) {
            $http({
                url: adminurl + 'user/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteuser')
                }
            }).success(callback);
        },
        saveUser: function (data, callback) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneImages: function (id, callback) {
            $http({
                url: adminurl + 'images/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedImages: function (images, callback) {
            $http({
                url: adminurl + 'images/findlimited',
                method: 'POST',
                data: {
                    'search': images.search,
                    'pagesize': parseInt(images.limit),
                    'pagenumber': parseInt(images.page)
                }
            }).success(callback);
        },
        deleteImages: function (callback) {
            $http({
                url: adminurl + 'images/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteimages')
                }
            }).success(callback);
        },
        saveImages: function (data, callback) {
            $http({
                url: adminurl + 'images/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneImageType: function (id, callback) {
            $http({
                url: adminurl + 'imagetype/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedImageType: function (imagetype, callback) {
            $http({
                url: adminurl + 'imagetype/findlimited',
                method: 'POST',
                data: {
                    'search': imagetype.search,
                    'pagesize': parseInt(imagetype.limit),
                    'pagenumber': parseInt(imagetype.page)
                }
            }).success(callback);
        },
        deleteImageType: function (callback) {
            $http({
                url: adminurl + 'imagetype/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteimagetype')
                }
            }).success(callback);
        },
        saveImageType: function (data, callback) {
            $http({
                url: adminurl + 'imagetype/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneResult: function (id, callback) {
            $http({
                url: adminurl + 'result/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedResult: function (result, callback) {
            $http({
                url: adminurl + 'result/findlimited',
                method: 'POST',
                data: {
                    'search': result.search,
                    'pagesize': parseInt(result.limit),
                    'pagenumber': parseInt(result.page)
                }
            }).success(callback);
        },
        deleteResult: function (callback) {
            $http({
                url: adminurl + 'result/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteresult')
                }
            }).success(callback);
        },
        saveResult: function (data, callback) {
            $http({
                url: adminurl + 'result/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        counter: function (callback) {
            $http({
                url: adminurl + 'user/counter',
                method: 'POST'
            }).success(callback);
        },
        getleaderboards: function (data, callback) {
            $http({
                url: adminurl + 'dailypost/leaderboard',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getSingleUser: function (uid, callback) {
            $http.get(adminurl + 'user/getOneUser?user=' + uid).success(callback);
        },
        getdistinctcities: function (callback) {
            $http.get(adminurl + 'user/distinctcity').success(callback);
        }

        //Add New Service
    }
})