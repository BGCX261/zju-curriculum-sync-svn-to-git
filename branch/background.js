// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var Config = Config || {};
(function(){
    Config.defaultDuration = [
        {"start":"08:00","end":"08:45"},
        {"start":"08:50","end":"09:35"},
        {"start":"09:50","end":"10:30"},
        {"start":"10:40","end":"11:25"},
        {"start":"11:30","end":"12:15"},
        {"start":"13:15","end":"14:00"},
        {"start":"14:05","end":"14:50"},
        {"start":"14:55","end":"15:40"},
        {"start":"15:55","end":"16:40"},
        {"start":"16:45","end":"17:30"},
        {"start":"18:30","end":"19:15"},
        {"start":"19:20","end":"20:05"},
        {"start":"20:10","end":"20:55"},
        {"start":"21:00","end":"21:45"}
    ];
    Config.defaultSemester = [
        {"start":"02-28","end":"05-01"},
        {"start":"05-02","end":"07-08"},
        {"start":"09-06","end":"11-10"},
        {"start":"11-16","end":"01-15"},
        {"start":"01-01","end":"12-31"}
    ];
    Config.setupDefault = function() {
        if (!window.localStorage["CourseDuration"]) {
            window.localStorage["CourseDuration"] = JSON.stringify(Config.defaultDuration);
        }
        if (!window.localStorage["SchoolSemester"]) {
            window.localStorage["SchoolSemester"] = JSON.stringify(Config.defaultSemester);
        }
    }
    Config.getSemester = function() {
        return JSON.parse(window.localStorage["SchoolSemester"]);
    }
    Config.getDuration = function() {
        return JSON.parse(window.localStorage["CourseDuration"]);
    }
    Config.setDuration = function(duration) {
        if (typeof duration === "string") {
            window.localStorage["CouserDuration"] = duration;
        } else {
            window.localStorage["CouserDuration"] = JSON.stringify(duration);
        }
    }
    Config.setupDefault();
})()
var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url' : 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url' : 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url' : 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key' : '142181023024.apps.googleusercontent.com',
    'consumer_secret' : 'pxCdMaMj2Ny4xty4QqDXn_xX',
    'scope' : 'https://www.googleapis.com/auth/calendar',
    'app_name' : '浙大课表同步助手'
});

function logout() {
    oauth.clearTokens();
};
