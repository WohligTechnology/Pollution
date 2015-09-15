var uploadres = [];
var selectedData = [];
var abc = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
window.uploadUrl = 'http://104.197.23.70/user/uploadfile';
//window.uploadUrl = 'http://192.168.2.22:1337/user/uploadfile';
//window.uploadUrl = 'http://localhost:1337/user/uploadfile';
phonecatControllers.controller('home', function ($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    NavigationService.countUser(function (data, status) {
        $scope.user = data;
    });
    NavigationService.counter(function (data, status) {
        console.log(data);
        $scope.count = data;
    });
});
phonecatControllers.controller('login', function ($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;

    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.login = {};
    $scope.verifylogin = function () {
        console.log($scope.login);
        if ($scope.login.email && $scope.login.password) {
            //            NavigationService.adminLogin($scope.login, function (data, status) {
            //                if (data.value == "false") {
            //                    $scope.isValidLogin = 0;
            //                } else {
            //                    $scope.isValidLogin = 1;
            //                    $.jStorage.set("adminuser", data);
            //                    $location.url("/home");
            //                }
            //            })
            if ($scope.login.email === adminlogin.username && $scope.login.password === adminlogin.password) {
                $scope.isValidLogin = 1;
                $.jStorage.set("adminuser", adminlogin);
                $location.url("/home");
            } else {
                $scope.isValidLogin = 0;
            }
        } else {
            console.log("blank login");
            $scope.isValidLogin = 0;
        }

    }
});
phonecatControllers.controller('headerctrl', function ($scope, TemplateService, $location, $routeParams, NavigationService) {
    $scope.template = TemplateService;
    //    if (!$.jStorage.get("adminuser")) {
    //        $location.url("/login");
    //
    //    }
});

phonecatControllers.controller('createorder', function ($scope, TemplateService, NavigationService, ngDialog, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Orders");
    TemplateService.title = $scope.menutitle;
    TemplateService.list = 2;
    TemplateService.content = "views/createorder.html";
    $scope.navigation = NavigationService.getnav();
    console.log($routeParams.id);

    $scope.order = {};

    $scope.submitForm = function () {
        console.log($scope.order);
        NavigationService.saveOrder($scope.order, function (data, status) {
            console.log(data);
            $location.url("/order");
        });
    };


    $scope.order.tag = [];
    $scope.ismatch = function (data, select) {
        abc.select = select;
        _.each(data, function (n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveTag(item, function (data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.order.tag = select.selected;
            }
        });
        console.log($scope.artwork.tag);
    }


    $scope.refreshOrder = function (search) {
        $scope.tag = [];
        if (search) {
            NavigationService.findArtMedium(search, $scope.order.tag, function (data, status) {
                $scope.tag = data;
            });
        }
    };

    $scope.GalleryStructure = [{
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }, {
        "name": "image",
        "type": "image"
    }, {
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }];

    $scope.persons = [{
        "id": 1,
        "name": "first option"
    }, {
        "id": 2,
        "name": "first option"
    }, {
        "id": 3,
        "name": "first option"
    }, {
        "id": 4,
        "name": "first option"
    }, {
        "id": 5,
        "name": "first option"
    }];

    NavigationService.getUser(function (data, status) {
        $scope.persons = data;
    });

});




phonecatControllers.controller('UserCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/user.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.User = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedUser($scope.pagedata, function (data, status) {
            _.each(data.data, function (n) {
                var timestamp = n._id.toString().substring(0, 8);
                var createdate = new Date(parseInt(timestamp, 16) * 1000);
                n.createdate = createdate;
                if (n.gallery && n.gallery.length > 0) {
                    n.lastgallery = n.gallery[n.gallery.length - 1];
                }
                if (n.post && n.post.length > 0) {
                    n.lastpost = n.post[n.post.length - 1];
                }
            });
            $scope.user = data;
            console.log($scope.user);
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function () {
        NavigationService.deleteUser(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deleteuser', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'UserCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createUserCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createuser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    $scope.submitForm = function () {
        NavigationService.saveUser($scope.user, function (data, status) {
            $location.url('/user');
        });
    };
    $scope.user.gallery = [];
    $scope.GalleryStructure = [{
        "name": "Id",
        "type": "text"
    }, {
        "name": "FinalImage",
        "type": "text"
    }, {
        "name": "FacebookPostid",
        "type": "text"
    }, {
        "name": "TwitterPostid",
        "type": "text"
    }];
    $scope.user.dailypost = [];
    $scope.DailyPostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
    $scope.user.post = [];
    $scope.PostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
});
phonecatControllers.controller('editUserCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edituser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    NavigationService.getOneUser($routeParams.id, function (data, status) {
        $scope.user = data;
        console.log($scope.user);
        if (!$scope.user.gallery) {
            $scope.user.gallery = [];
        }
        if (!$scope.user.dailypost) {
            $scope.user.dailypost = [];
        }
        if (!$scope.user.post) {
            $scope.user.post = [];
        }
    });
    $scope.submitForm = function () {
        $scope.user._id = $routeParams.id;
        NavigationService.saveUser($scope.user, function (data, status) {
            $location.url('/user');
        });
    };

    $scope.GalleryStructure = [{
        "name": "_id",
        "type": "text"
    }, {
        "name": "imagefinal",
        "type": "text"
    }, {
        "name": "FacebookPostid",
        "type": "text"
    }, {
        "name": "TwitterPostid",
        "type": "text"
    }];

    $scope.DailyPostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
    $scope.PostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
});
phonecatControllers.controller('ImagesCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Images');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/Images.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Images = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedImages($scope.pagedata, function (data, status) {
            $scope.images = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function () {
        NavigationService.deleteImages(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deleteimages', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'ImagesCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createImagesCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Images');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createimages.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.images = {};
    $scope.submitForm = function () {
        NavigationService.saveImages($scope.images, function (data, status) {
            $location.url('/images');
        });
    };
});
phonecatControllers.controller('editImagesCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Images');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editimages.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.images = {};
    NavigationService.getOneImages($routeParams.id, function (data, status) {
        $scope.images = data;
    });
    $scope.submitForm = function () {
        $scope.images._id = $routeParams.id;
        NavigationService.saveImages($scope.images, function (data, status) {
            $location.url('/images');
        });
    };
});
phonecatControllers.controller('ImageTypeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('ImageType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/ImageType.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.ImageType = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedImageType($scope.pagedata, function (data, status) {
            $scope.imagetype = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function () {
        NavigationService.deleteImageType(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deleteimagetype', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'ImageTypeCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createImageTypeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('ImageType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createimagetype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.imagetype = {};
    $scope.submitForm = function () {
        NavigationService.saveImageType($scope.imagetype, function (data, status) {
            $location.url('/imagetype');
        });
    };
});
phonecatControllers.controller('editImageTypeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('ImageType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editimagetype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.imagetype = {};
    NavigationService.getOneImageType($routeParams.id, function (data, status) {
        $scope.imagetype = data;
    });
    $scope.submitForm = function () {
        $scope.imagetype._id = $routeParams.id;
        NavigationService.saveImageType($scope.imagetype, function (data, status) {
            $location.url('/imagetype');
        });
    };
});
phonecatControllers.controller('ResultCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Result');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/Result.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Result = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedResult($scope.pagedata, function (data, status) {
            $scope.result = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function () {
        NavigationService.deleteResult(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deleteresult', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'ResultCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createResultCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Result');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createresult.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.result = {};
    $scope.submitForm = function () {
        NavigationService.saveResult($scope.result, function (data, status) {
            $location.url('/result');
        });
    };
    $scope.result.standings = [];
    $scope.StandingsStructure = [{
        "name": "UserId",
        "type": "text"
    }, {
        "name": "Rank",
        "type": "text"
    }, {
        "name": "Points",
        "type": "text"
    }];
});
phonecatControllers.controller('editResultCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Result');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editresult.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.result = {};
    NavigationService.getOneResult($routeParams.id, function (data, status) {
        $scope.result = data;
        if (!$scope.result.standings) {
            $scope.result.standings = [];
        }
    });
    $scope.submitForm = function () {
        $scope.result._id = $routeParams.id;
        NavigationService.saveResult($scope.result, function (data, status) {
            $location.url('/result');
        });
    };
    $scope.StandingsStructure = [{
        "name": "UserId",
        "type": "text"
    }, {
        "name": "Rank",
        "type": "text"
    }, {
        "name": "Points",
        "type": "text"
    }];
});
phonecatControllers.controller('leaderboardCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $filter, $window) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Leaderboard');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/leaderboard.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.leaderboard = {};
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.city = 'Mumbai';
    $scope.pagedata.date = $filter('date')(new Date(), 'dd-MM-yyyy');

    NavigationService.getdistinctcities(function (data, status) {
        $scope.cities = data.sort();
        setTimeout(function () {
            $scope.reload($scope.pagedata);
        }, 1000);
    });

    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        console.log($scope.pagedata);
        if ($scope.pagedata.date == "ThreeDays" || $scope.pagedata.date == "FiveDays" || $scope.pagedata.date == "TenDays") {
            $scope.pagedata.type = $scope.pagedata.date;
            delete $scope.pagedata.date;
        }

        NavigationService.getleaderboards($scope.pagedata, function (data, status) {
            console.log(data);
            if (data.value != false)
                $scope.leaderboard = data;
            else
                $scope.leaderboard = [];
        });
    }

    $scope.opensocailpage = function (uid) {
        console.log(uid);
        NavigationService.getSingleUser(uid, function (data, status) {
            console.log(data);
            $scope.userdetails = data;
            if ($scope.userdetails.provider == "Facebook") {
                $window.open("https://www.facebook.com/" + $scope.userdetails.fbid, '_new');
            } else if ($scope.userdetails.provider == "Twitter") {
                $window.open("https://twitter.com/" + $scope.userdetails.username, '_new');
            }
        });
    }

    //    href = "#/userdetails/{{value.leaderboard._id}}"

    $scope.datejson = [{
        name: "15-09-2015",
        value: "15-09-2015"
    }, {
        name: "16-09-2015",
        value: "16-09-2015"
    }, {
        name: "17-09-2015",
        value: "17-09-2015"
    }, {
        name: "18-09-2015",
        value: "18-09-2015"
    }, {
        name: "19-09-2015",
        value: "19-09-2015"
    }, {
        name: "20-09-2015",
        value: "20-09-2015"
    }, {
        name: "21-09-2015",
        value: "21-09-2015"
    }, {
        name: "22-09-2015",
        value: "22-09-2015"
    }, {
        name: "23-09-2015",
        value: "23-09-2015"
    }, {
        name: "24-09-2015",
        value: "24-09-2015"
    }, {
        name: "25-09-2015",
        value: "25-09-2015"
    }, {
        name: "26-09-2015",
        value: "26-09-2015"
    }, {
        name: "27-09-2015",
        value: "27-09-2015"
    }, {
        name: "3 Days",
        value: "ThreeDays"
    }, {
        name: "5 Days",
        value: "FiveDays"
    }, {
        name: "10 Days",
        value: "TenDays"
    }];

});
phonecatControllers.controller('userdetailCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $window) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/userdetails.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.userdetails = {};

    NavigationService.getSingleUser($routeParams.id, function (data, status) {
        console.log(data);
        $scope.userdetails = data;
    });

    $scope.opensocailpage = function () {
        if ($scope.userdetails.provider == "Facebook") {
            $window.open("https://www.facebook.com/" + $scope.userdetails.fbid);
        } else if ($scope.userdetails.provider == "Twitter") {
            $window.open("https://twitter.com/" + $scope.userdetails.username);
        }
    }

}); //Add New Controller