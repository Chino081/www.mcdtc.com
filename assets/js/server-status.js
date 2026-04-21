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
    setHtml('contactOnlinePlayers', onlineHtml);
    setText('heroOnlinePlayers', `${online}/${max}`);
    setText('serverFullVersion', versionFull);
    setText('contactFullVersion', versionFull);
    setText('serverSimpleVersion', recommendedVersion);
    setText('contactVersionTag', recommendedVersion);
    setText('serverPing', pingText);
    setText('contactServerPing', pingText);
    setText('lastUpdated', nowText());
    setText('contactLastUpdated', nowText());
    setText('heroServerStatus', '服务器在线');
}

function setOfflineStatus() {
    setHtml('onlinePlayers', '<span class="online-dot" style="background:#f44336;"></span> 离线');
    setHtml('contactOnlinePlayers', '<span class="online-dot" style="background:#f44336;"></span> 离线');
    setText('heroOnlinePlayers', '离线');
    setText('serverFullVersion', '无法获取');
    setText('contactFullVersion', '无法获取');
    setText('serverSimpleVersion', '离线');
    setText('contactVersionTag', '离线');
    setText('serverPing', '--ms');
    setText('contactServerPing', '--ms');
    setText('lastUpdated', nowText());
    setText('contactLastUpdated', nowText());
    setText('heroServerStatus', '服务器离线');
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
    // 创建自定义通知而不是使用alert
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 300px;
        word-break: break-all;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 添加CSS动画
if (!document.querySelector('#copy-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'copy-notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
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
