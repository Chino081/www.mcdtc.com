(function() {
    'use strict';

    // ========== 配置 ==========
    // 修改为你的后端地址，本地开发用 localhost:3000，部署后改为实际域名
    var API_BASE = window.GUESTBOOK_API || 'https://api.mcdtc.com/api';

    // ========== 工具函数 ==========
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function formatTime(dateStr) {
        return dateStr || '';
    }

    // ========== API 请求 ==========
    function fetchMessages() {
        return fetch(API_BASE + '/messages?limit=50')
            .then(function(res) { return res.json(); })
            .then(function(body) {
                if (body.code === 0) return body.data || [];
                return [];
            })
            .catch(function() { return []; });
    }

    function postMessage(nickname, message) {
        return fetch(API_BASE + '/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: nickname, message: message })
        })
        .then(function(res) { return res.json(); });
    }

    function deleteMessage(id, password) {
        return fetch(API_BASE + '/messages/' + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        })
        .then(function(res) { return res.json(); });
    }

    // ========== 渲染 ==========
    function renderMessages(msgs) {
        var list = document.getElementById('guestbookList');
        var empty = document.getElementById('gbEmpty');
        if (!list) return;

        list.innerHTML = '';

        if (!msgs || msgs.length === 0) {
            if (empty) {
                list.appendChild(empty);
            } else {
                var el = document.createElement('div');
                el.className = 'gb-empty';
                el.id = 'gbEmpty';
                el.textContent = '还没有留言，来写第一条吧！';
                list.appendChild(el);
            }
            return;
        }

        for (var i = 0; i < msgs.length; i++) {
            var m = msgs[i];
            var item = document.createElement('div');
            item.className = 'gb-item';
            item.innerHTML =
                '<button class="gb-delete" data-id="' + m.id + '" aria-label="删除此留言"><i class="fa fa-times"></i></button>' +
                '<div class="gb-item-header">' +
                    '<span class="gb-nickname">' + escapeHtml(m.nickname) + '</span>' +
                    '<span class="gb-time">' + formatTime(m.created_at) + '</span>' +
                '</div>' +
                '<p class="gb-text">' + escapeHtml(m.message) + '</p>';
            list.appendChild(item);
        }
    }

    // ========== 提交留言 ==========
    function submit() {
        var nickEl = document.getElementById('gbNickname');
        var msgEl = document.getElementById('gbMessage');
        var submitBtn = document.getElementById('gbSubmit');
        if (!nickEl || !msgEl) return;

        var nickname = nickEl.value.trim();
        var message = msgEl.value.trim();

        if (!nickname) { nickEl.focus(); return; }
        if (!message) { msgEl.focus(); return; }

        // 防止重复提交
        if (submitBtn) submitBtn.disabled = true;

        postMessage(nickname, message)
            .then(function(body) {
                if (body.code === 0) {
                    msgEl.value = '';
                    loadMessages();
                } else {
                    alert(body.msg || '提交失败，请稍后再试');
                }
            })
            .catch(function() {
                alert('网络错误，请检查后端服务是否启动');
            })
            .then(function() {
                if (submitBtn) submitBtn.disabled = false;
            });
    }

    // ========== 加载留言 ==========
    function loadMessages() {
        fetchMessages().then(renderMessages);
    }

    // ========== 初始化 ==========
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

        // 删除留言（需要管理员密码）
        if (list) {
            list.addEventListener('click', function(e) {
                var btn = e.target.closest('.gb-delete');
                if (!btn) return;
                var id = btn.getAttribute('data-id');
                if (!id) return;
                var password = prompt('请输入管理员密码：');
                if (!password) return;

                deleteMessage(id, password)
                    .then(function(body) {
                        if (body.code === 0) {
                            loadMessages();
                        } else {
                            alert(body.msg || '删除失败');
                        }
                    })
                    .catch(function() { alert('网络错误'); });
            });
        }

        // 更新提示文字
        var tipEl = document.querySelector('.gb-tip');
        if (tipEl) {
            tipEl.textContent = '所有访客共享留言板，留言将展示给所有人。';
        }

        loadMessages();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
