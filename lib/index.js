'use strict';

var _signalrNoJquery = require('signalr-no-jquery');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var imServerUrl = 'https://im.yiqifei.com/';

var _connection = void 0;
var _hubProxy = void 0;
var _eventMap = {};

// signalR.connectionState = {
//     connecting: 0,
//     connected: 1,
//     reconnecting: 2,
//     disconnected: 4
// };

function registEvent(owner, eventName, callback) {
    eventName = eventName.toLowerCase();

    if (!_eventMap[owner]) {
        _eventMap[owner] = {};
    }

    _eventMap[owner][eventName] = callback;
}

function unregistEvents(owner) {
    delete _eventMap[owner];
}

function raiseEvent(eventName) {
    eventName = eventName.toLowerCase();

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    for (var owner in _eventMap) {
        var _eventMap$owner;

        typeof _eventMap[owner][eventName] == 'function' && (_eventMap$owner = _eventMap[owner])[eventName].apply(_eventMap$owner, args);
    }
}

var IMServer = function IMServer() {
    _classCallCheck(this, IMServer);
};

IMServer.connectionState = _signalrNoJquery.signalR.connectionState.disconnected;

IMServer.start = function (token) {
    return new Promise(function (resolve, reject) {
        if (_connection == null || _connection.state == _signalrNoJquery.signalR.connectionState.disconnected) {
            _connection = (0, _signalrNoJquery.hubConnection)(imServerUrl + '/signalr', { qs: 'token=' + token });
            _connection.stateChanged(function () {
                IMServer.state = _connection.state;
                raiseEvent('SYS:OnConnectionStateChanged');
            });

            _hubProxy = _connection.createHubProxy('chat');

            _hubProxy.on('OnChat', function (message) {
                return raiseEvent('OnChat', message);
            });
            _hubProxy.on('OnKickOff', function (message) {
                return raiseEvent('OnKickOff', message);
            });
            _hubProxy.on('OnGroupNotify', function (message) {
                return raiseEvent('OnGroupNotify', message);
            });
            _hubProxy.on('OnSNSNotify', function (message) {
                return raiseEvent('OnSNSNotify', message);
            });
            _hubProxy.on('OnCSService_Chat', function (message) {
                return raiseEvent('OnCSService_Chat', message);
            });
            _hubProxy.on('OnCSService_ChatRequest', function (message) {
                return raiseEvent('OnCSService_ChatRequest', message);
            });
            _hubProxy.on('OnCSService_ChatRequestCancelled', function (message) {
                return raiseEvent('OnCSService_ChatRequestCancelled', message);
            });
            _hubProxy.on('OnCSService_UserLeave', function (message) {
                return raiseEvent('OnCSService_UserLeave', message);
            });
            _hubProxy.on('OnCSService_ForwardingResult', function (message) {
                return raiseEvent('OnCSService_ForwardingResult', message);
            });
            _hubProxy.on('OnCSUser_Chat', function (message) {
                return raiseEvent('OnCSUser_Chat', message);
            });
            _hubProxy.on('OnCSUser_ServiceJoin', function (message) {
                return raiseEvent('OnCSUser_ServiceJoin', message);
            });
            _hubProxy.on('OnCSUser_ServiceLeave', function (message) {
                return raiseEvent('OnCSUser_ServiceLeave', message);
            });
            _hubProxy.on('OnCSUser_RequestTimeout', function (message) {
                return raiseEvent('OnCSUser_RequestTimeout', message);
            });
            _hubProxy.on('OnCSUser_Disconnected', function (message) {
                return raiseEvent('OnCSUser_Disconnected', message);
            });

            _connection.start().done(resolve).fail(reject);
        } else {
            resolve();
        }
    });
};

IMServer.stop = function () {
    if (_connection != null && _connection.state != _signalrNoJquery.signalR.connectionState.disconnected) {
        _connection.stop();
    }
};

IMServer.methods = {
    addFriend: function addFriend(message) {
        return _hubProxy.invoke('AddFriend', message);
    },
    addGroupMember: function addGroupMember(message) {
        return _hubProxy.invoke('AddGroupMember', message);
    },
    createGroup: function createGroup(message) {
        return _hubProxy.invoke('CreateGroup', message);
    },
    deleteFriend: function deleteFriend(message) {
        return _hubProxy.invoke('DeleteFriend', message);
    },
    dismissGroup: function dismissGroup(message) {
        return _hubProxy.invoke('DismissGroup', message);
    },
    exitGroup: function exitGroup(message) {
        return _hubProxy.invoke('ExitGroup', message);
    },
    friendResponse: function friendResponse(message) {
        return _hubProxy.invoke('FriendResponse', message);
    },
    getLoginUser: function getLoginUser() {
        return _hubProxy.invoke('GetLoginUser');
    },
    groupResponse: function groupResponse(message) {
        return _hubProxy.invoke('GroupResponse', message);
    },
    joinGroup: function joinGroup(message) {
        return _hubProxy.invoke('JoinGroup', message);
    },
    modifyGroupInfo: function modifyGroupInfo(message) {
        return _hubProxy.invoke('ModifyGroupInfo', message);
    },
    preAddFriend: function preAddFriend(message) {
        return _hubProxy.invoke('PreAddFriend', message);
    },
    removeGroupMember: function removeGroupMember(message) {
        return _hubProxy.invoke('RemoveGroupMember', message);
    },
    sendChat: function sendChat(message) {
        return _hubProxy.invoke('SendChat', message);
    },
    setReadMessage: function setReadMessage(message) {
        return _hubProxy.invoke('SetReadMessage', message);
    },
    csService_Accept: function csService_Accept(message) {
        return _hubProxy.invoke('CSService_Accept', message);
    },
    csService_Chat: function csService_Chat(message) {
        return _hubProxy.invoke('CSService_Chat', message);
    },
    csService_Forwarding: function csService_Forwarding(message) {
        return _hubProxy.invoke('CSService_Forwarding', message);
    },
    csService_Leave: function csService_Leave(message) {
        return _hubProxy.invoke('CSService_Leave', message);
    },
    csService_Reject: function csService_Reject(message) {
        return _hubProxy.invoke('CSService_Reject', message);
    },
    csUser_Chat: function csUser_Chat(message) {
        return _hubProxy.invoke('CSUser_Chat', message);
    },
    csUser_Enter: function csUser_Enter(message) {
        return _hubProxy.invoke('CSUser_Enter', message);
    },
    csUser_Leave: function csUser_Leave(message) {
        return _hubProxy.invoke('CSUser_Leave', message);
    },
    csUser_Request: function csUser_Request(message) {
        return _hubProxy.invoke('CSUser_Request', message);
    }

    // 客户端事件
};
IMServer.events = {
    off: function off(owner) {
        return unregistEvents(owner);
    },

    onConnectionStateChanged: function onConnectionStateChanged(owner, callback) {
        return registEvent(owner, 'SYS:OnConnectionStateChanged', callback);
    },

    onChat: function onChat(owner, callback) {
        return registEvent(owner, 'OnChat', callback);
    },
    onKickOff: function onKickOff(owner, callback) {
        return registEvent(owner, 'OnKickOff', callback);
    },
    onGroupNotify: function onGroupNotify(owner, callback) {
        return registEvent(owner, 'OnGroupNotify', callback);
    },
    onSNSNotify: function onSNSNotify(owner, callback) {
        return registEvent(owner, 'OnSNSNotify', callback);
    },
    onCSService_Chat: function onCSService_Chat(owner, callback) {
        return registEvent(owner, 'OnCSService_Chat', callback);
    },
    onCSService_ChatRequest: function onCSService_ChatRequest(owner, callback) {
        return registEvent(owner, 'OnCSService_ChatRequest', callback);
    },
    onCSService_ChatRequestCancelled: function onCSService_ChatRequestCancelled(owner, callback) {
        return registEvent(owner, 'OnCSService_ChatRequestCancelled', callback);
    },
    onCSService_UserLeave: function onCSService_UserLeave(owner, callback) {
        return registEvent(owner, 'OnCSService_UserLeave', callback);
    },
    onCSService_ForwardingResult: function onCSService_ForwardingResult(owner, callback) {
        return registEvent(owner, 'OnCSService_ForwardingResult', callback);
    },
    onCSUser_Chat: function onCSUser_Chat(owner, callback) {
        return registEvent(owner, 'OnCSUser_Chat', callback);
    },
    onCSUser_ServiceJoin: function onCSUser_ServiceJoin(owner, callback) {
        return registEvent(owner, 'OnCSUser_ServiceJoin', callback);
    },
    onCSUser_ServiceLeave: function onCSUser_ServiceLeave(owner, callback) {
        return registEvent(owner, 'OnCSUser_ServiceLeave', callback);
    },
    onCSUser_RequestTimeout: function onCSUser_RequestTimeout(owner, callback) {
        return registEvent(owner, 'OnCSUser_RequestTimeout', callback);
    },
    onCSUser_Disconnected: function onCSUser_Disconnected(owner, callback) {
        return registEvent(owner, 'OnCSUser_Disconnected', callback);
    }
};


exports.ConnectionState = _signalrNoJquery.signalR.connectionState;
exports.IMServer = IMServer;