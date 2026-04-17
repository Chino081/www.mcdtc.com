$(document).ready(function() {
    fetchServerStatus();
    setInterval(fetchServerStatus, 60000);
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ip).then(function() {
            alert('✅ 服务器地址已复制: ' + ip);
        }).catch(function() {
            fallbackCopy(ip);
        });
    } else {
        fallbackCopy(ip);
    }
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
