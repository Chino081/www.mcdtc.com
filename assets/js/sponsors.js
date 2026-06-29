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
