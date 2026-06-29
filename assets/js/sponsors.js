(function() {
    'use strict';

    var DATA_URLS = [
        'assets/data/sponsors.json',
        '/assets/data/sponsors.json'
    ];
    var FALLBACK_SPONSORS = [
        {
            name: '浅若清风',
            description: '感谢支持服务器运营',
            amount: '￥50',
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

    function renderSponsors(sponsors) {
        var list = document.getElementById('sponsorList');
        if (!list) return;

        list.innerHTML = '';

        if (!sponsors || sponsors.length === 0) {
            var empty = document.createElement('li');
            empty.className = 'sponsor-empty';
            empty.textContent = '暂时还没有赞助记录。';
            list.appendChild(empty);
            list.classList.remove('is-scrollable');
            hideScrollHint();
            return;
        }

        sponsors.forEach(function(sponsor, index) {
            var item = document.createElement('li');
            var badgeText = sponsor.amount || sponsor.badge || '感谢支持';
            item.innerHTML =
                '<span class="sponsor-rank">' + (index + 1) + '</span>' +
                '<div class="sponsor-person">' +
                    '<h4>' + escapeHtml(sponsor.name) + '</h4>' +
                    '<p>' + escapeHtml(sponsor.description) + '</p>' +
                '</div>' +
                '<strong>' + escapeHtml(badgeText) + '</strong>';
            list.appendChild(item);
        });

        if (sponsors.length > 4) {
            list.classList.add('is-scrollable');
            enableDragScroll(list);
            showScrollHint();
        } else {
            list.classList.remove('is-scrollable');
            hideScrollHint();
        }
    }

    function getScrollHint() {
        var hint = document.getElementById('sponsorScrollHint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'sponsorScrollHint';
            hint.className = 'sponsor-scroll-hint';
            hint.innerHTML = '<i class="fa fa-arrows-v" aria-hidden="true"></i> 赞助名单较多，可上下滑动查看';
            var list = document.getElementById('sponsorList');
            if (list && list.parentNode) {
                list.parentNode.insertBefore(hint, list);
            }
        }
        return hint;
    }

    function showScrollHint() { getScrollHint().style.display = ''; }

    function hideScrollHint() {
        var hint = document.getElementById('sponsorScrollHint');
        if (hint) hint.style.display = 'none';
    }

    function enableDragScroll(container) {
        if (container._sponsorDragBound) return;
        container._sponsorDragBound = true;

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

    function loadSponsors() {
        if (!window.fetch) {
            renderSponsors(FALLBACK_SPONSORS);
            return;
        }

        fetchSponsors(0)
            .then(function(data) { renderSponsors(data); })
            .catch(function(error) {
                if (window.console && console.warn) {
                    console.warn('赞助名单 JSON 读取失败，已使用内置兜底数据。', error);
                }
                renderSponsors(FALLBACK_SPONSORS);
            });
    }

    function fetchSponsors(index) {
        if (index >= DATA_URLS.length) {
            return Promise.reject(new Error('Failed to load sponsor data'));
        }

        return fetch(DATA_URLS[index], { cache: 'no-cache' })
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to load ' + DATA_URLS[index]);
                return res.json();
            })
            .then(function(data) {
                if (!Array.isArray(data)) throw new Error('Sponsor data is not an array');
                return data;
            })
            .catch(function() {
                return fetchSponsors(index + 1);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSponsors);
    } else {
        loadSponsors();
    }
})();
