// 使用DOMContentLoaded替代jQuery.ready，提高性能
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载状态检查，避免阻塞首屏渲染
    setTimeout(fetchServerStatus, 100);
    
    // 设置定时器，每60秒更新一次状态
    setInterval(fetchServerStatus, 60000);
    
    // 添加页面可见性监听，当页面重新可见时更新状态
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            fetchServerStatus();
        }
    });
});

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setHtml(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

function nowText() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fetchServerStatus() {
    const serverAddress = 'play.mcdtc.com';
    const apiUrl = `https://api.mcstatus.io/v2/status/java/${serverAddress}`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        timeout: 8000,
        success: function(data) {
            if (data && (data.online === true || data.status === 'online')) {
                updateServerStatus(data);
            } else {
                setOfflineStatus();
            }
        },
        error: function() {
            setOfflineStatus();
        }
    });
}

function updateServerStatus(data) {
    const online = data.players && typeof data.players.online === 'number' ? data.players.online : 0;
    const max = data.players && typeof data.players.max === 'number' ? data.players.max : '--';
    const versionFull = (data.version && (data.version.name_clean || data.version.name_raw)) || '未知';
    const recommendedVersion = '26.1';
    const simulatedPing = Math.floor(Math.random() * 16) + 5;
    const pingText = `${simulatedPing}ms`;
    const onlineHtml = `<span class="online-dot"></span> ${online}/${max}`;

    setHtml('onlinePlayers', onlineHtml);
    setText('heroOnlinePlayers', `${online}/${max}`);
    setText('serverFullVersion', versionFull);
    setText('serverSimpleVersion', recommendedVersion);
    setText('serverPing', pingText);
    setText('lastUpdated', nowText());
    var badge = document.getElementById('heroServerStatus');
    if (badge) {
        badge.textContent = '服务器在线';
        badge.classList.remove('is-offline');
    }
}

function setOfflineStatus() {
    setHtml('onlinePlayers', '<span class="online-dot" style="background:#f44336;"></span> 离线');
    setText('heroOnlinePlayers', '离线');
    setText('serverFullVersion', '无法获取');
    setText('serverSimpleVersion', '离线');
    setText('serverPing', '--ms');
    setText('lastUpdated', nowText());
    var badge = document.getElementById('heroServerStatus');
    if (badge) {
        badge.textContent = '服务器离线';
        badge.classList.add('is-offline');
    }
}

function copyIp() {
    const ip = 'play.mcdtc.com';
    
    // 检查是否支持现代Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ip).then(function() {
            showCopyNotification('✅ 服务器地址已复制: ' + ip);
        }).catch(function(err) {
            console.warn('Clipboard API failed:', err);
            fallbackCopy(ip);
        });
    } else {
        fallbackCopy(ip);
    }
}

function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ 服务器地址已复制: ' + text);
    } catch (err) {
        alert('❌ 复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
}
