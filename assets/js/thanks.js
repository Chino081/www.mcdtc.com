(function() {
    'use strict';

    var DATA_URLS = [
        'assets/data/thanks.json',
        '/assets/data/thanks.json'
    ];
    var FALLBACK_THANKS = [
        {
            name: '浅若清风',
            description: '感谢支持服务器运营',
            amount: '￥50',
            badge: '赞助支持'
        },
        {
            name: '我爱大爪车',
            description: '感谢支持服务器运营',
            amount: '￥10',
            badge: '赞助支持'
        },
        {
            name: '程曦',
            description: '大股东 · 长期支持服务器运营',
            badge: '特别鸣谢'
        },
        {
            name: '热心玩家们',
            description: '维护费用、活动奖品与社区建设支持',
            badge: '持续更新'
        },
        {
            name: '匿名赞助者',
            description: '默默支持服务器的朋友们',
            badge: '感谢有你'
        }
    ];

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str || ''));
        return div.innerHTML;
    }

    function renderThanks(items) {
        var list = document.getElementById('thanksList');
        if (!list) return;

        list.innerHTML = '';

        if (!items || items.length === 0) {
            var empty = document.createElement('li');
            empty.className = 'thanks-empty';
            empty.textContent = '暂时还没有记录。';
            list.appendChild(empty);
            list.classList.remove('is-scrollable');
            hideScrollHint();
            return;
        }

        items.forEach(function(itemData, index) {
            var item = document.createElement('li');
            var badgeText = itemData.amount || itemData.badge || '感谢支持';
            item.innerHTML =
                '<span class="thanks-rank">' + (index + 1) + '</span>' +
                '<div class="thanks-person">' +
                    '<h4>' + escapeHtml(itemData.name) + '</h4>' +
                    '<p>' + escapeHtml(itemData.description) + '</p>' +
                '</div>' +
                '<strong>' + escapeHtml(badgeText) + '</strong>';
            list.appendChild(item);
        });

        if (items.length > 4) {
            list.classList.add('is-scrollable');
            enableDragScroll(list);
            showScrollHint();
        } else {
            list.classList.remove('is-scrollable');
            hideScrollHint();
        }
    }

    function getScrollHint() {
        var hint = document.getElementById('thanksScrollHint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'thanksScrollHint';
            hint.className = 'thanks-scroll-hint';
            hint.innerHTML = '<i class="fa fa-arrows-v" aria-hidden="true"></i> 名单较多，可上下滑动查看';
            var list = document.getElementById('thanksList');
            if (list && list.parentNode) {
                list.parentNode.insertBefore(hint, list);
            }
        }
        return hint;
    }

    function showScrollHint() { getScrollHint().style.display = ''; }

    function hideScrollHint() {
        var hint = document.getElementById('thanksScrollHint');
        if (hint) hint.style.display = 'none';
    }

    function enableDragScroll(container) {
        if (container._thanksDragBound) return;
        container._thanksDragBound = true;

        var pointerId = null;
        var startY = 0;
        var startScroll = 0;
        var lastY = 0;
        var lastTime = 0;
        var velocity = 0;
        var rafId = 0;
        var moved = false;

        container.addEventListener('pointerdown', function(e) {
            if (e.pointerType === 'touch') return;
            pointerId = e.pointerId;
            moved = false;
            container.classList.add('is-dragging');
            startY = e.clientY;
            startScroll = container.scrollTop;
            lastY = e.clientY;
            lastTime = Date.now();
            velocity = 0;
            cancelAnimationFrame(rafId);
            try { container.setPointerCapture(e.pointerId); } catch (_) {}
        });

        container.addEventListener('pointermove', function(e) {
            if (e.pointerId !== pointerId) return;
            var dy = e.clientY - startY;
            if (Math.abs(dy) > 5) moved = true;
            container.scrollTop = startScroll - dy;
            var now = Date.now();
            var dt = now - lastTime;
            if (dt > 0) velocity = (lastY - e.clientY) / dt;
            lastY = e.clientY;
            lastTime = now;
        });

        function endDrag(e) {
            if (e.pointerId !== pointerId) return;
            pointerId = null;
            container.classList.remove('is-dragging');
            try { container.releasePointerCapture(e.pointerId); } catch (_) {}
            animateMomentum();
        }

        container.addEventListener('pointerup', endDrag);
        container.addEventListener('pointercancel', endDrag);
        container.addEventListener('click', function(e) {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
                moved = false;
            }
        }, true);

        function animateMomentum() {
            cancelAnimationFrame(rafId);
            function step() {
                if (Math.abs(velocity) < 0.05) return;
                container.scrollTop += velocity * 16;
                velocity *= 0.93;
                rafId = requestAnimationFrame(step);
            }
            step();
        }
    }

    function loadThanks() {
        if (!window.fetch) {
            renderThanks(FALLBACK_THANKS);
            return;
        }

        fetchThanks(0)
            .then(function(data) { renderThanks(data); })
            .catch(function(error) {
                if (window.console && console.warn) {
                    console.warn('鸣谢名单 JSON 读取失败，已使用内置兜底数据。', error);
                }
                renderThanks(FALLBACK_THANKS);
            });
    }

    function fetchThanks(index) {
        if (index >= DATA_URLS.length) {
            return Promise.reject(new Error('Failed to load thanks data'));
        }

        return fetch(DATA_URLS[index], { cache: 'no-cache' })
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to load ' + DATA_URLS[index]);
                return res.json();
            })
            .then(function(data) {
                if (!Array.isArray(data)) throw new Error('Thanks data is not an array');
                return data;
            })
            .catch(function() {
                return fetchThanks(index + 1);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadThanks);
    } else {
        loadThanks();
    }
})();
