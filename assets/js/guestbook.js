(function() {
    'use strict';

    var STORAGE_KEY = 'mcdtc-guestbook';
    var MAX_ITEMS = 50;

    function getMessages() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch(e) {
            return [];
        }
    }

    function saveMessages(msgs) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); } catch(e) {}
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function formatTime(ts) {
        var d = new Date(ts);
        var pad = function(n) { return String(n).padStart(2, '0'); };
        return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function render() {
        var list = document.getElementById('guestbookList');
        var empty = document.getElementById('gbEmpty');
        if (!list) return;

        var msgs = getMessages();
        list.innerHTML = '';

        if (msgs.length === 0) {
            list.appendChild(empty || createEmpty());
            return;
        }

        for (var i = msgs.length - 1; i >= 0; i--) {
            var m = msgs[i];
            var item = document.createElement('div');
            item.className = 'gb-item';
            item.innerHTML =
                '<button class="gb-delete" data-index="' + i + '" aria-label="删除此留言"><i class="fa fa-times"></i></button>' +
                '<div class="gb-item-header">' +
                    '<span class="gb-nickname">' + escapeHtml(m.nickname) + '</span>' +
                    '<span class="gb-time">' + formatTime(m.time) + '</span>' +
                '</div>' +
                '<p class="gb-text">' + escapeHtml(m.message) + '</p>';
            list.appendChild(item);
        }
    }

    function createEmpty() {
        var el = document.createElement('div');
        el.className = 'gb-empty';
        el.id = 'gbEmpty';
        el.textContent = '还没有留言，来写第一条吧！';
        return el;
    }

    function submit() {
        var nickEl = document.getElementById('gbNickname');
        var msgEl = document.getElementById('gbMessage');
        if (!nickEl || !msgEl) return;

        var nickname = nickEl.value.trim();
        var message = msgEl.value.trim();

        if (!nickname) { nickEl.focus(); return; }
        if (!message) { msgEl.focus(); return; }

        var msgs = getMessages();
        msgs.push({
            nickname: nickname.substring(0, 20),
            message: message.substring(0, 200),
            time: Date.now()
        });

        if (msgs.length > MAX_ITEMS) {
            msgs = msgs.slice(msgs.length - MAX_ITEMS);
        }

        saveMessages(msgs);
        msgEl.value = '';
        render();
    }

    function init() {
        var submitBtn = document.getElementById('gbSubmit');
        var list = document.getElementById('guestbookList');

        if (submitBtn) {
            submitBtn.addEventListener('click', submit);
        }

        var msgEl = document.getElementById('gbMessage');
        if (msgEl) {
            msgEl.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                }
            });
        }

        if (list) {
            list.addEventListener('click', function(e) {
                var btn = e.target.closest('.gb-delete');
                if (!btn) return;
                var index = parseInt(btn.getAttribute('data-index'), 10);
                var msgs = getMessages();
                if (index >= 0 && index < msgs.length) {
                    msgs.splice(index, 1);
                    saveMessages(msgs);
                    render();
                }
            });
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
