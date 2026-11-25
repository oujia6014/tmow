/* T-MOW 1.4 业务扩展与定稿 Bento 视觉组件库（普通脚本，零 ESM，兼容 file:// 直接打开）
   覆盖范围：1.4 银翼启动页 + 定稿 Bento 仪表板首页（含多设备列表对比）+ 1.4-1~1.4-8 全部代码对齐能力 */
(function (global) {
  'use strict';

  function stBadge() {
    return '';
  }

  /* 1.4 配网与 LoRa 配对大环形进度组件（228px，32刻度 + 碳黑到尾部主题橙渐变 + 端点圆珠） */
  function provRing14(pct, iconName, subLabel) {
    const p = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
    const S = 228, W = 14, R = 94, TR = 81, c = S / 2;
    const rad = -Math.PI / 2 + (p / 100) * Math.PI * 2;
    const mx = c + Math.cos(rad) * R;
    const my = c + Math.sin(rad) * R;
    const arcPath = (p0, p1) => {
      if (p1 <= p0) return '';
      if (p1 - p0 >= 99.9) {
        return `M ${c} ${c - R} A ${R} ${R} 0 1 1 ${(c - 0.1).toFixed(1)} ${c - R}`;
      }
      const a0 = -Math.PI / 2 + (p0 / 100) * Math.PI * 2;
      const a1 = -Math.PI / 2 + (p1 / 100) * Math.PI * 2;
      const x0 = c + Math.cos(a0) * R, y0 = c + Math.sin(a0) * R;
      const x1 = c + Math.cos(a1) * R, y1 = c + Math.sin(a1) * R;
      const large = (p1 - p0) > 50 ? 1 : 0;
      return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };
    const tailStart = Math.max(0, p - 42);
    const aTail = -Math.PI / 2 + (tailStart / 100) * Math.PI * 2;
    const tx = c + Math.cos(aTail) * R;
    const ty = c + Math.sin(aTail) * R;
    const ticks = Array.from({ length: 32 }, (_, i) => {
      const t = -Math.PI / 2 + i * (Math.PI * 2 / 32);
      const major = i % 4 === 0;
      const len = major ? 9 : 5;
      const ratio = (i / 32) * 100;
      const active = ratio <= p;
      const nearTip = active && ratio >= Math.max(0, p - 24);
      const stroke = nearTip ? '#F08300' : active ? '#1E232B' : '#C9D2DC';
      const op = nearTip ? (major ? '.9' : '.58') : active ? (major ? '.65' : '.36') : (major ? '.5' : '.28');
      return `<line x1="${(c + Math.cos(t) * TR).toFixed(1)}" y1="${(c + Math.sin(t) * TR).toFixed(1)}" x2="${(c + Math.cos(t) * (TR - len)).toFixed(1)}" y2="${(c + Math.sin(t) * (TR - len)).toFixed(1)}" stroke="${stroke}" stroke-opacity="${op}" stroke-width="${major ? 2.4 : 1.6}" stroke-linecap="round"/>`;
    }).join('');
    return `<div class="prov-ring14">
      <div class="prov-ring14-halo"></div>
      <svg viewBox="0 0 ${S} ${S}" aria-hidden="true">
        <defs>
          <linearGradient id="provRingGrad" gradientUnits="userSpaceOnUse" x1="${tx.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}">
            <stop offset="0%" stop-color="#1E232B"/>
            <stop offset="35%" stop-color="#3C322B"/>
            <stop offset="72%" stop-color="#C86A06"/>
            <stop offset="100%" stop-color="#F08300"/>
          </linearGradient>
        </defs>
        <circle cx="${c}" cy="${c}" r="${R + 14}" fill="none" stroke="#DCE3EC" stroke-width="1" stroke-dasharray="4 6"/>
        <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#E5EBF1" stroke-width="${W}"/>
        ${p > 0 ? `<path d="${arcPath(0, p)}" fill="none" stroke="#1E232B" stroke-width="${W}" stroke-linecap="round"/>` : ''}
        ${p > 2 ? `<path d="${arcPath(tailStart, p)}" fill="none" stroke="url(#provRingGrad)" stroke-width="${W}" stroke-linecap="round"/>` : ''}
        <g>${ticks}</g>
        <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="10" fill="rgba(240,131,0,0.2)"/>
        <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="6.5" fill="#FFFFFF" stroke="#F08300" stroke-width="3"/>
      </svg>
      <div class="prov-ring14-core">
        <div class="prov-ring14-pct t14-num"><b>${p}</b><span>%</span></div>
        <div class="prov-ring14-tag">${ic(iconName || 'wifi', 'sm')}<span>${subLabel || '正在联网'}</span></div>
      </div>
    </div>`;
  }

  /* 1.4 主题橙色雷达（沿用原图造型，仅将绿色转为主色橙） */
  function radarRings14() {
    return `<img class="rings radar-orange14" src="${IMG}add/background_add_device.png" alt="">`;
  }

  function radarSweep14() {
    return `<img class="sweep radar-orange14" src="${IMG}add/scan_radar_large.png" alt="">`;
  }

  function pairingFlow14(wired = false) {
    const dots = [0, 1, 2, 3, 4, 5, 6].map(i => {
      const x = 94 + i * 12;
      const fill = i >= 4 ? '#F08300' : '#1E232B';
      const op = (0.35 + i * 0.09).toFixed(2);
      return `<circle cx="${x}" cy="56" r="${i === 6 ? 3 : 2.2}" fill="${fill}" fill-opacity="${op}"/>`;
    }).join('');
    return `<div class="flow-diagram14" aria-hidden="true">
      <div class="flow-node14 bt">${ic('bt', 'lg')}</div>
      <svg class="flow-dots14" viewBox="0 0 260 112" fill="none">${dots}</svg>
      <div class="flow-node14 net">${ic(wired ? 'cable' : 'wifi', 'lg')}</div>
    </div>`;
  }

  /* 公共 16° 斜切橙翼主按钮与冷钛银卡片构造器 */
  function ctaMain(act, iconHtml, label, cls = '', disabled = false, extraAttr = '') {
    return `<button class="v3-cta-main ${cls}" ${disabled ? 'disabled' : (act ? `data-act="${act}"` : '')} ${extraAttr}><span class="wing">${iconHtml}</span><span class="txt">${label}</span></button>`;
  }

  /* 弹窗内专用克制深冷钛/危险按钮（不带斜切橙翼） */
  function modalBtn(act, label, cls = '', disabled = false, extraAttr = '') {
    const danger = cls === 'danger';
    const st = danger ? 'style="background:#D92D20;color:#fff;width:100%"' : 'style="width:100%"';
    return `<button class="btn ${danger ? '' : 'btn-primary'}" ${st} ${disabled ? 'disabled' : (act ? `data-act="${act}"` : '')} ${extraAttr}>${label}</button>`;
  }

  function alertBox14(tone, icon, title, desc, actionHtml = '') {
    const bg = tone === 'bad' ? '#FFECEF' : tone === 'warn' ? '#FFF5D6' : '#EAF3FD';
    const fg = tone === 'bad' ? '#C22736' : tone === 'warn' ? '#8A5A00' : '#165B9E';
    const bd = tone === 'bad' ? '#F4C2C7' : tone === 'warn' ? '#FDE68A' : '#BFE0FA';
    return `<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:14px;background:${bg};border:1px solid ${bd};color:${fg}">
      <span style="flex:none;margin-top:1px">${ic(icon, 'sm')}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13.5px;font-weight:700;color:#14171C">${title}</div>
        ${desc ? `<div style="font-size:12px;margin-top:2px;line-height:1.45;color:${fg}">${desc}</div>` : ''}
      </div>
      ${actionHtml}
    </div>`;
  }

  /* 1.4 实机启动页（实机雕塑展台 + LOGO + 2px 光轨；无型号标签、无旧 App 图标） */
  function renderSplash14() {
    return `
    <div class="splash14" data-go="login" title="点击进入登录页（或切到首页）" style="padding:138px 26px 46px">
      ${statusbar()}
      <div class="splash14-stage">
        <div class="splash14-halo"></div>
        <img src="${IMG}add/device_product_large.png" alt="T-MOW 割草机器人">
        <div class="splash14-shadow"></div>
      </div>
      <div class="splash14-brand">
        <img class="logo" src="${IMG}home/logo.png" alt="T-MOW">
        <div class="splash14-track"><div class="pulse-line14 anim"></div></div>
        <div style="font-size:11px;font-weight:600;letter-spacing:.14em;color:#5B6470">SMART LAWN ROBOTICS</div>
      </div>
    </div>`;
  }

  /* 1.4-1 认证流程：登录（密码/验证码）/ 注册 / 忘记密码 / 隐私政策抽屉 */
  function renderLogin() {
    const isPwd = ui.loginMode !== 'code';
    return `
    <div class="auth14">
      ${statusbar()}
      <div class="auth14-scroll">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <img src="${IMG}home/logo.png" alt="T-MOW" style="height:22px;width:auto">
          ${stBadge('code')}
        </div>
        <div class="auth14-bar"></div>
        <div style="font-size:23px;font-weight:700;color:#14171C;letter-spacing:-.02em">欢迎使用 T-MOW</div>
        <div style="margin-top:4px;font-size:13px;color:#5B6470;line-height:1.45">登录账号后管理你的智能割草机器人、庭院地图与通信配件。</div>

        <div class="seg" style="margin-top:20px">
          <button class="${isPwd ? 'on' : ''}" data-act="loginMode" data-v="pwd">密码登录</button>
          <button class="${!isPwd ? 'on' : ''}" data-act="loginMode" data-v="code">验证码登录</button>
        </div>

        <div style="margin-top:16px;display:flex;flex-direction:column;gap:12px">
          <div>
            <div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">邮箱账号</div>
            <div class="auth14-box">${ic('msg', 'sm')}<input type="email" value="owen.li@tmow-garden.com" aria-label="邮箱"></div>
          </div>
          ${isPwd ? `
          <div>
            <div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">登录密码</div>
            <div class="auth14-box">${ic('lock', 'sm')}<input type="${ui.pwdShown ? 'text' : 'password'}" value="Garden2026!" aria-label="密码">
              <button data-act="pwdEye" aria-label="显隐">${ic('eye', 'sm')}</button></div>
            <div style="margin-top:4px;font-size:11px;color:#5B6470">8–20 位字符，需包含字母与数字</div>
          </div>` : `
          <div>
            <div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">邮箱验证码</div>
            <div class="auth14-box">${ic('pulse2', 'sm')}<input type="text" value="482910" aria-label="验证码">
              <button data-act="sendAuthCode" style="font-size:11.5px;font-weight:600;padding:5px 9px;border-radius:7px;background:#fff;border:1px solid #DCE2EA;white-space:nowrap">发送验证码</button></div>
            <div style="margin-top:4px;font-size:11px;color:#5B6470">验证码 5 分钟内有效</div>
          </div>`}

          <button data-act="toggleLoginAgree" style="display:flex;align-items:flex-start;gap:9px;text-align:left;font-size:12px;color:#5B6470;line-height:1.45;margin-top:2px">
            <span style="width:18px;height:18px;border-radius:5px;border:1.5px solid ${ui.loginAgree ? '#1E232B' : '#B8C2CC'};background:${ui.loginAgree ? '#1E232B' : '#fff'};color:#fff;display:inline-flex;align-items:center;justify-content:center;flex:none;margin-top:1px">${ui.loginAgree ? ic('check', 'sm') : ''}</span>
            <span>我已阅读并同意 <span data-act="openPrivacyDoc" style="color:#14171C;font-weight:700;text-decoration:underline">《用户协议》与《隐私政策》</span></span>
          </button>

          <button class="btn btn-primary btn-push" style="flex:none;width:100%;margin-top:4px" ${ui.loginAgree ? '' : 'disabled'} data-act="doLogin">登录</button>
        </div>

        <div style="margin-top:auto;padding-top:18px;display:flex;justify-content:space-between;font-size:13px">
          <button data-act="goResetPwd" style="color:#5B6470">忘记密码？</button>
          <button data-act="goRegister" style="color:#5B6470">没有账号？<strong style="color:#14171C">立即注册</strong></button>
        </div>
      </div>
    </div>`;
  }

  function renderRegister() {
    return `
    <div class="sub-page">${nav('注册账号' + stBadge('code'))}
      <div class="scroll">
        <div style="font-size:13px;color:#5B6470;margin:6px 2px 14px">使用邮箱验证码快速创建 T-MOW 账号，完成后自动绑定当前隐私授权记录。</div>
        <div class="group pad" style="display:flex;flex-direction:column;gap:12px">
          <div><div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">邮箱地址</div>
            <div class="auth14-box">${ic('msg', 'sm')}<input type="email" value="new.owner@tmow-garden.com" aria-label="注册邮箱"></div></div>
          <div><div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">6 位验证码</div>
            <div class="auth14-box">${ic('pulse2', 'sm')}<input type="text" value="639104" aria-label="验证码">
              <button data-act="sendAuthCode" style="font-size:11.5px;font-weight:600;padding:5px 9px;border-radius:7px;background:#fff;border:1px solid #DCE2EA">重新发送</button></div></div>
          <div><div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">设置登录密码</div>
            <div class="auth14-box">${ic('lock', 'sm')}<input type="password" value="Garden2026!" aria-label="设置密码"></div></div>
        </div>
        <button data-act="toggleLoginAgree" style="display:flex;align-items:center;gap:8px;margin:14px 4px;font-size:12px;color:#5B6470">
          <span style="width:18px;height:18px;border-radius:5px;border:1.5px solid #1E232B;background:${ui.loginAgree ? '#1E232B' : '#fff'};color:#fff;display:inline-flex;align-items:center;justify-content:center">${ui.loginAgree ? ic('check', 'sm') : ''}</span>
          <span>同意《用户协议》与《隐私政策》</span>
        </button>
        <button class="btn btn-primary btn-push" style="width:100%" ${ui.loginAgree ? '' : 'disabled'} data-act="doLogin">完成注册并登录</button>
      </div>
    </div>`;
  }

  function renderResetPwd() {
    return `
    <div class="sub-page">${nav('重置密码' + stBadge('code'))}
      <div class="scroll">
        <div style="font-size:13px;color:#5B6470;margin:6px 2px 14px">输入注册邮箱并完成验证码校验，验证通过后即可重设密码。</div>
        <div class="group pad" style="display:flex;flex-direction:column;gap:12px">
          <div><div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">注册邮箱</div>
            <div class="auth14-box">${ic('msg', 'sm')}<input type="email" value="owen.li@tmow-garden.com" aria-label="注册邮箱"></div></div>
          <div><div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">验证码</div>
            <div class="auth14-box">${ic('pulse2', 'sm')}<input type="text" value="159284" aria-label="验证码">
              <button data-act="sendAuthCode" style="font-size:11.5px;font-weight:600;padding:5px 9px;border-radius:7px;background:#fff;border:1px solid #DCE2EA">获取验证码</button></div></div>
          <div><div style="font-size:12px;font-weight:600;color:#5B6470;margin-bottom:5px">新密码（8–20 位字母+数字）</div>
            <div class="auth14-box">${ic('lock', 'sm')}<input type="password" value="NewGarden26!" aria-label="新密码"></div></div>
        </div>
        <button class="btn btn-primary btn-push" style="width:100%;margin-top:16px" data-act="resetPwdDone">确认重置密码</button>
      </div>
    </div>`;
  }

  /* 定稿首页：组合 B（3 顶栏 + 全画幅庭院地图 + 居中胶囊 & 右侧错层浮钮 + 双栏遥测控台） */
  function renderHomeBento() {
    const s = ui.state, owner = ui.role === 'owner';
    const working = ['mowing', 'paused', 'pending', 'fault', 'blocked'].includes(s);
    const sim = ['mowing', 'paused', 'pending', 'fault', 'returning', 'blocked'].includes(s);
    if (sim) ensureSim();
    const mower = sim ? simRobot() : { idle: [72, DOCK[1]], nomap: [72, DOCK[1]], mapping: [300, 143], dockFail: [96, 334] }[s] || [290, 190];
    const nomap = s === 'nomap', off = s === 'offline', blocked = s === 'blocked', mapping = s === 'mapping';
    const otaBusy = s === 'upgrading' || (['starting', 'upgrading', 'rebooting'].includes(ui.otaSt) && !['offline', 'nomap', 'mapping'].includes(s));

    const dropmowRun = !!ui.dropmowActive && ['mowing', 'paused', 'pending', 'returning'].includes(s);
    const canDropmow = !off && !otaBusy && ['idle', 'nomap'].includes(s);
    const stMeta = {
      idle:      { dot: 'ok',   title: '正在充电',   sub: '3 区 · 170 ㎡', bat: 86, sig: 'Wi-Fi' },
      mowing:    { dot: 'ok',   title: dropmowRun ? 'Dropmow 割草中' : '正在割草', sub: dropmowRun ? '即放即割 · 自动识边作业中' : simSub(), bat: 74, sig: 'Wi-Fi' },
      paused:    { dot: 'warn', title: '已暂停',     sub: simSub(), bat: 76, sig: 'Wi-Fi' },
      returning: { dot: 'ok',   title: '正在回桩',   sub: simSub(), bat: 68, sig: 'Wi-Fi' },
      pending:   { dot: 'idle', title: STATES.pending.title, sub: '等待设备回执', bat: 76, sig: 'Wi-Fi' },
      offline:   { dot: 'off',  title: '设备离线',   sub: '最后在线 今天 10:32', bat: 0, sig: '离线' },
      fault:     { dot: 'bad',  title: '设备被抬起', sub: '请放回平整草坪', bat: 71, sig: 'Wi-Fi' },
      blocked:   { dot: 'bad',  title: '区域阻挡',   sub: '区域 1 受阻 · bit7', bat: 71, sig: 'Wi-Fi' },
      nomap:     { dot: 'idle', title: '还没有地图', sub: '可先建图或点 Dropmow 即放即割', bat: 86, sig: 'Wi-Fi' },
      upgrading: { dot: 'idle', title: '固件升级中', sub: '升级后自动恢复', bat: 86, sig: 'Wi-Fi' },
      dockFail:  { dot: 'warn', title: '对桩失败',   sub: '已尝试 3 次未成功', bat: 42, sig: 'Wi-Fi' },
      mapping:   { dot: 'ok',   title: '正在建图',   sub: '区域 1 沿边中', bat: 82, sig: 'Wi-Fi' },
    }[s] || { dot: 'ok', title: STATES[s].title, sub: '3 区 · 170 ㎡', bat: 86, sig: 'Wi-Fi' };

    const nextInfo = pickNextSched(SCHEDS);
    const activeMapName = (ui.maps[ui.activeMapIdx || 0] || ui.maps[0]).name;
    const lastRec = (typeof RECS !== 'undefined' && ui.data !== 'empty') ? (RECS.find(r => r.status === 'COMPLETED') || RECS[0]) : null;

    let banner = '';
    if (s === 'fault') banner = `<div class="hp-banner bad" data-act="fault">${ic('alert', 'sm')}<span class="grow"><b>设备被抬起</b> · 放回草坪后继续</span><span class="act-link">详情</span></div>`;
    else if (s === 'dockFail') banner = `<div class="hp-banner warn">${ic('dock', 'sm')}<span class="grow"><b>对桩失败 3 次</b> · 检查充电桩遮挡</span><button class="act-link" data-act="joystick">遥控回桩</button></div>`;
    else if (off) banner = `<div class="hp-banner warn">${ic('wifioff', 'sm')}<span class="grow"><b>设备离线</b> · 无法下发远程控制指令</span></div>`;

    let actionsHtml = '';
    if (otaBusy) {
      actionsHtml = `${ctaMain('', ic('upgrade', 'sm'), '升级中', '', true)}<button class="v1-btn-sq" title="升级进度" data-act="ota">${ic('right', 'sm')}</button>`;
    } else if (s === 'idle') {
      actionsHtml = ctaMain('start', ic('play', 'sm'), '开始割草');
    } else if (s === 'mowing') {
      actionsHtml = dropmowRun
        ? `${ctaMain('pause', ic('pause', 'sm'), '暂停作业')}<button class="v1-btn-sq danger" title="结束 Dropmow 任务" data-act="stopDropmow">${ic('stop')}</button>`
        : `${ctaMain('pause', ic('pause', 'sm'), '暂停作业')}<button class="v1-btn-sq" title="返回充电桩 107" data-act="openDockConfirm">${ic('dock')}</button>`;
    } else if (s === 'paused') {
      actionsHtml = dropmowRun
        ? `${ctaMain('resume', ic('play', 'sm'), '继续割草')}<button class="v1-btn-sq danger" title="结束 Dropmow 任务" data-act="stopDropmow">${ic('stop')}</button>`
        : `${ctaMain('resume', ic('play', 'sm'), '继续割草')}<button class="v1-btn-sq danger" title="结束任务" data-act="cancel">${ic('stop')}</button>`;
    } else if (s === 'returning') {
      actionsHtml = ctaMain('pause', ic('pause', 'sm'), '暂停回桩');
    } else if (s === 'pending') {
      actionsHtml = `${ctaMain('', '<span class="spin"></span>', '等待回执', '', true)}<button class="v1-btn-sq" disabled>${ic('dock')}</button>`;
    } else if (s === 'fault') {
      actionsHtml = `${ctaMain('fault', ic('alert', 'sm'), '查看处理')}<button class="v1-btn-sq" title="返回充电桩 107" data-act="openDockConfirm">${ic('dock')}</button>`;
    } else if (s === 'blocked') {
      actionsHtml = `${ctaMain('openBlockedSheet', ic('alert', 'sm'), '处理阻挡')}<button class="v1-btn-sq" title="返回充电桩 107" data-act="openDockConfirm">${ic('dock')}</button>`;
    } else if (s === 'nomap') {
      actionsHtml = ctaMain('mapStart', ic('map', 'sm'), '开始建图');
    } else if (s === 'mapping') {
      actionsHtml = `${ctaMain('backToMapping', ic('pad', 'sm'), '继续横屏建图')}<button class="v1-btn-sq" title="查看实时位置" data-act="joystick">${ic('locate')}</button>`;
    } else if (s === 'dockFail') {
      actionsHtml = ctaMain('dock', ic('dock', 'sm'), '重新对桩');
    } else {
      actionsHtml = ctaMain('', ic('play', 'sm'), '开始割草', '', true);
    }

    const wmLawn = `<svg class="stat-wm" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 14L40 8M8 24L42 18M6 34L40 28M10 42L36 38"/></svg>`;
    const wmClock = `<svg class="stat-wm" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="26" cy="26" r="17" stroke-dasharray="3 4"/><path d="M26 16v10l7 4"/></svg>`;
    const wmJoy = `<svg class="stat-wm" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="26" cy="26" r="16" stroke-dasharray="3 3"/><circle cx="26" cy="26" r="6"/><path d="M26 6v6M26 40v6M6 26h6M40 26h6"/></svg>`;
    const batChip = (pct, charging) => {
      const w = Math.max(0, Math.min(100, pct)) * 0.14;
      const fill = pct <= 20 ? '#C22736' : '#199459';
      return `<span class="hp-bat-pill"><svg viewBox="0 0 24 14" fill="none"><rect x="1" y="1.5" width="19" height="11" rx="2.5" stroke="#8C96A4" stroke-width="1.3"/><path d="M21.5 5v4" stroke="#8C96A4" stroke-width="1.5" stroke-linecap="round"/>${pct > 0 ? `<rect x="3" y="3.5" width="${w.toFixed(1)}" height="7" rx="1.2" fill="${fill}"/>` : ''}${charging ? `<path d="M11.2 2.5L8.4 7.3h2.3l-.9 4.2 3.8-5.1h-2.4z" fill="#FFFFFF" stroke="#16794B" stroke-width="0.6"/>` : ''}</svg><span class="t14-num" style="font-size:18px;font-weight:700">${off ? '--' : pct}${off ? '' : '<small style="font-size:11px;color:#5B6470">%</small>'}</span></span>`;
    };
    const statCard = ({ tone = '', icon, label, value, pill = '', pillCls = 'ok', foot = '', wm = '', act, dis = false }) => `
      <button class="v3-stat-box ${tone}" data-act="${act}" ${dis ? 'disabled' : ''}>
        ${wm}
        <div class="stat-top">
          <span class="stat-ico">${ic(icon, 'sm')}</span>
          <span class="k">${label}</span>
          ${pill ? `<span class="stat-pill ${pillCls}">${pill}</span>` : ''}
          <span class="stat-arr">›</span>
        </div>
        <div class="v t14-num">${value}</div>
        ${foot ? `<div class="stat-foot">${foot}</div>` : ''}
      </button>`;

    const joyBlocked = off || s === 'fault' || otaBusy;
    const joyDisReason = off ? '设备离线' : s === 'fault' ? '故障未解除' : '升级中锁定';
    const joyModeLbl = (ui.joyMode || 'body') === 'map' ? '地图正北' : '车体前向';
    const joyGearSpd = { 低: '0.15', 中: '0.25', 高: '0.35' }[ui.gear] || '0.25';

    const bodyHtml = working ? `
      <div class="hp-mow-box">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;gap:8px">
          <span style="color:#325330;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" id="stateSub">${stMeta.sub}</span>
          <strong class="t14-num" id="simArea" style="flex:none">${simArea()}</strong>
        </div>
        <div class="hp-mow-bar"><i id="simBar" style="width:${simTotal()}%"></i></div>
      </div>` : mapping ? `
      <div class="v3-two-cols">
        ${statCard({ tone: 'tone-green', icon: 'map', label: '沿边点位', value: `${ui.edgePts || 24} 点 · 实线`, wm: wmLawn, act: 'backToMapping' })}
        ${statCard({ icon: 'locate', label: '闭合进度', value: '82% · 未闭合', wm: wmClock, act: 'backToMapping' })}
      </div>` : nomap ? `
      <div class="v3-two-cols">
        ${statCard({ tone: 'tone-green', icon: 'shield', label: '建图条件', value: '在桩 · 电量 ≥50%', wm: wmLawn, act: 'mapStart' })}
        ${statCard({ tone: 'tone-amber', icon: 'dock', label: '返回充电桩', value: '一键回桩', foot: '<span class="stat-foot-txt">自动对准充电桩</span>', wm: wmClock, act: 'dock' })}
      </div>` : `
      <div class="v3-two-cols">
        ${statCard({
          tone: lastRec ? 'tone-green' : '',
          icon: 'records',
          label: '上次割草',
          pill: lastRec ? lastRec.res[1] : '',
          value: lastRec ? `${lastRec.w} · ${lastRec.area} ㎡` : '暂无记录',
          foot: lastRec ? `<span class="stat-mini-bar"><i style="width:${lastRec.prog || 100}%"></i></span><span class="stat-foot-txt">${ic('clock', 'sm')}${lastRec.dur}</span>` : `<span class="stat-foot-txt">完成后自动同步</span>`,
          wm: wmLawn,
          act: 'records'
        })}
        ${statCard({
          tone: (off || otaBusy || s === 'idle' || s === 'returning') ? '' : 'tone-amber',
          icon: 'dock',
          label: '返回充电桩',
          pill: s === 'idle' ? '在桩' : s === 'returning' ? '回桩中' : '',
          pillCls: s === 'idle' ? 'ok' : 'amber',
          value: s === 'idle' ? '已在充电桩' : s === 'returning' ? '正在回桩' : (off || otaBusy) ? '暂不可用' : '一键回桩',
          foot: `<span class="stat-foot-txt" style="color:${(off || otaBusy) ? '#8A94A2' : '#5B6470'}">${s === 'idle' ? '电量充足，随时可出发' : s === 'returning' ? '自动对准充电桩中' : (off || otaBusy) ? joyDisReason : '结束或暂停后自动回充'}</span>`,
          wm: wmClock,
          act: working ? 'openDockConfirm' : 'dock',
          dis: off || otaBusy || s === 'idle' || s === 'returning'
        })}
      </div>`;

    const otaDlg = otaBusy ? `<div class="sheet-wrap" style="align-items:center;padding:20px"><div class="sheet" style="border-radius:18px;text-align:center">
      <div style="margin:0 auto 10px;width:46px;height:46px;border-radius:50%;background:#E8F6EE;color:#16794B;display:flex;align-items:center;justify-content:center">${ic('upgrade')}</div>
      <h3 style="margin-bottom:6px">设备正在升级</h3><div class="body" style="margin-bottom:16px">升级期间请勿断电，升级及重启完成后自动恢复控制。</div>
      <button class="btn btn-primary" style="width:100%" data-act="ota">查看升级进度</button></div></div>` : '';

    return `
    <div class="hp-home">
      ${statusbar()}
      <div class="hp-home-map">
        <div class="map">${lawnSvg({ sim, mower, view: '-12 40 422 800', fit: 'slice', k: 1.08, shortSide: 390, noObst: true, heading: sim ? MOW.heading : { idle: 0, nomap: 0, mapping: 95 }[s] ?? 75, active: s === 'mowing' || s === 'returning' || s === 'mapping', mode: nomap ? 'nomap' : mapping ? 'mapping' : 'map' })}</div>
        ${off ? '<div class="map-dim"></div>' : ''}
      </div>
      <div class="hp-top-scrim"></div>

      <div class="hp-topbar">
        <button class="v3-brandpill ${(ui.sheet === 'switch' || ui.homeView === 'list') ? 'open' : ''}" data-act="switch">
          <img class="logo" src="${IMG}home/logo.png" alt="T-MOW">
          <span class="sep"></span>
          <span class="name"><span class="status-dot ${stMeta.dot}"></span>${DEVICES[ui.deviceIdx]}${owner ? '' : '<span class="tag">共享</span>'}${ic('down', 'sm')}</span>
        </button>
        <div class="v3-fab-pair">
          <button class="v3-sq-fab" data-act="messages" aria-label="消息中心">${ic('msg', 'sm')}${unread() ? `<span class="dot">${unread()}</span>` : ''}</button>
          <button class="v3-sq-fab" data-act="settings" aria-label="设备设置">${ic('gear', 'sm')}</button>
        </div>
      </div>

      ${banner}

      <div class="hp-bottom-dock">
        <div class="hp-map-controls">
          <div class="hp-left-rail">
            <button class="hp-dropmow-pill dropmow-hero" ${canDropmow ? '' : 'disabled'} title="Dropmow 即放即割一键启动" data-act="openDropmow"><span class="dm-wing">${ic('dropmow', 'sm')}</span><span>Dropmow</span></button>
          </div>

          <div class="hp-right-dock">
            <button class="t14-num" ${off ? 'disabled' : ''} title="割草偏好 / 刀盘高度" data-act="prefSheet">${ic('blade', 'sm')}<span>${ui.bladeH}mm</span></button>
            <button ${joyBlocked ? 'disabled' : ''} title="手动遥控" data-act="joystick">${ic('pad', 'sm')}<span>遥控</span></button>
            <button ${nomap ? 'disabled' : ''} title="地图管理（114 切换/编辑）" data-act="mapmgr">${ic('map', 'sm')}<span>地图</span></button>
            <button title="定时任务列表" data-act="schedules">${nextInfo && ui.data !== 'empty' ? '<i class="dock-dot" aria-hidden="true"></i>' : ''}${ic('cal', 'sm')}<span>定时</span></button>
            <button title="镜头回到机器人位置" data-act="recenter">${ic('locate', 'sm')}<span>定位</span></button>
          </div>
        </div>

        <section class="v3-panel">
          <div class="v3-tele-bar">
            <div style="display:flex;align-items:center;gap:7px;min-width:0">
              <span class="status-dot ${stMeta.dot}"></span>
              <strong style="font-size:15px;white-space:nowrap">${stMeta.title}</strong>
              ${dropmowRun ? '<span class="dm-tag">即放即割</span>' : `<span style="font-size:11.5px;color:#5B6470;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">· ${mapping ? '区域 1 沿边' : nomap ? '待建图' : activeMapName}</span>`}
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex:none">
              <button class="hp-sig-chip" data-act="openSigDetail" title="查看信号与网络详情 id:12">${ic(off ? 'wifioff' : 'wifi', 'sm')}<span>${stMeta.sig}</span></button>
              ${batChip(off ? 0 : stMeta.bat, s === 'idle')}
            </div>
          </div>
          <div class="v3-body">
            ${bodyHtml}
            <div class="v3-actions">${actionsHtml}</div>
          </div>
        </section>
      </div>

      ${tabbar('home')}
      ${blocked ? renderBlockedOverlay14() : ''}
      ${otaDlg}
    </div>`;
  }

  /* 切换设备底部弹窗（精确对齐 visual-preview.html 屏 3 与 1.3 交互） */
  function renderSwitchDropdown14() {
    const showCnt = ui.homeView === 'list' ? Math.max(ui.count, 2) : Math.max(ui.count, 1);
    const devMeta = [
      { sub: 'X5 · 在线充电中 86% · S3 LoRa 已配对', off: false },
      { sub: 'X5 · 离线 · 最后在线 昨天 18:20', off: true }
    ];
    return `
    <div class="sheet-wrap" data-act="close">
      <div class="sheet">
        <div class="grab"></div>
        <div style="font-size:16px;font-weight:700;color:#14171C;margin-bottom:12px">切换设备</div>
        <div class="group" style="border:1px solid #DCE2EA;margin-bottom:12px">
          ${DEVICES.slice(0, showCnt).map((n, i) => {
            const m = devMeta[i] || devMeta[0];
            const active = i === ui.deviceIdx;
            const badge = active
              ? `<span class="t14-badge ok" style="margin-left:4px;font-size:10.5px;padding:1px 7px;border-radius:999px">当前</span>`
              : (i === 1 ? `<span class="t14-badge" style="margin-left:4px;font-size:10.5px;padding:1px 7px;border-radius:999px;color:#5B6470">共享</span>` : '');
            return `<button class="cell sw14-row" data-pick="${i}">
              <img src="${IMG}add/device_product_large.png" alt="${n}" style="width:52px;height:40px;object-fit:contain;flex:none;${m.off ? 'opacity:.55' : ''}">
              <span class="grow" style="min-width:0">
                <div style="font-size:14.5px;font-weight:700;color:#14171C;display:flex;align-items:center">${n}${badge}</div>
                <div class="caption t14-num" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.sub}</div>
              </span>
              ${active ? `<span style="color:#14171C;flex:none;display:inline-flex">${ic('check', 'sm')}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
        <button class="btn btn-secondary" style="width:100%" data-act="add">+ 添加设备</button>
      </div>
    </div>`;
  }

  /* 区域阻挡弹窗（居中实机大图 + 精简文案 + 上短下长操作组） */
  function renderBlockedOverlay14() {
    return `
    <div class="sheet-wrap blk14-wrap">
      <div class="blk14-card">
        <div class="blk14-hero">
          <div class="blk14-halo" aria-hidden="true"></div>
          <img src="${IMG}add/device_product_large.png" alt="T-MOW 割草机">
        </div>
        <div class="blk14-copy">
          <div class="blk14-title">区域 1 无法通行</div>
          <div class="blk14-desc">设备连续避障未果，已停机并关闭刀盘。请确认周围无障碍后再继续。</div>
        </div>
        <div class="blk14-actions">
          <div class="blk14-subrow">
            <button class="blk14-btn-secondary" data-act="bit7Skip" title="指令 122">跳过区域 1</button>
            <button class="blk14-btn-danger" data-act="bit7Cancel" title="指令 106">结束割草</button>
          </div>
          <button class="blk14-btn-primary" data-act="bit7Resume">已清障，继续割草</button>
        </div>
      </div>
    </div>`;
  }

  /* 1.4-2 三分支添加设备向导（x5 / s3 / LoRa）与 S3 配件设置页 */
  function renderAddDevice14() {
    return `
    <div class="sub-page">${nav('添加设备' + stBadge('code'), `<button class="r" data-act="scanAdd" aria-label="扫码添加 X5" style="color:var(--color-text-primary)">${ic('qr', 'lg')}</button>`)}
      <div class="scroll">
        <div style="margin:6px 2px 14px">
          <div class="display" style="font-size:22px">选择设备或配件${stBadge('code')}</div>
          <div class="body" style="margin-top:4px">请选择要添加的设备类型：X5 割草机为主设备，S3 为配套通信网关。</div>
        </div>
        <button class="type-card" data-act="provMower">
          <div class="txt"><div class="title">X5 割草机</div><div class="caption">直连家庭 Wi-Fi 或扫码绑定</div>
            <span class="go">添加主设备${ic('right', 'sm')}</span></div>
          <img src="${IMG}add/device_product_large.png" alt="X5">
        </button>
        <button class="type-card" data-act="provGw" style="height:132px">
          <div class="txt" style="max-width:62%"><div class="title">S3 通信配件</div><div class="caption">院子信号弱时添加 S3 联网，再配对 X5</div>
            <span class="go">S3 配件配网${ic('right', 'sm')}</span></div>
          <span class="gwpic">${GW_SVG}</span>
        </button>
        <button class="type-card" data-act="provLora" style="height:122px;margin-top:12px">
          <div class="txt" style="max-width:74%"><div class="title">S3–X5 LoRa 配对</div><div class="caption">已有 S3 与 X5，直接完成通信配件 LoRa 配对（支持在线三选一 / 离线前置检查）</div>
            <span class="go">进入 LoRa 配对${ic('right', 'sm')}</span></div>
        </button>
        <div style="text-align:center;margin-top:18px">
          <button class="link" style="font-size:13px;color:#5B6470" data-act="scanAdd">也可直接 <b style="color:#14171C">扫描 X5 机身二维码</b></button>
        </div>
      </div>
    </div>`;
  }

  function renderLoraProvPage() {
    const s3 = ui.s3OnlineState || 'new';
    const rings = radarRings14();
    const gwHero = GW_SVG.replace('<svg', '<svg class="dev gw"');
    const stepRow = (done, run, text, idx) => {
      const badge = done
        ? `<span style="width:20px;height:20px;border-radius:6px;background:#1E232B;color:#fff;display:inline-flex;align-items:center;justify-content:center">${ic('check', 'sm')}</span>`
        : run
          ? `<span style="width:20px;height:20px;border-radius:6px;background:#FFF3E3;color:#F08300;display:inline-flex;align-items:center;justify-content:center"><span class="spin" style="width:11px;height:11px"></span></span>`
          : `<span class="t14-num" style="width:20px;height:20px;border-radius:6px;background:#E6EBF1;color:#7F8996;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">${idx}</span>`;
      return `<div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#14171C">${badge}<span style="flex:1">${text}</span></div>`;
    };

    if (s3 === 'offline') {
      return `<div class="ob14">${statusbar()}
        <div class="ob14-nav"><button data-act="back" aria-label="返回">${ic('right', 'lg').replace('<svg', '<svg style="transform:scaleX(-1)"')}</button>
          <div class="t">S3–X5 LoRa 配对</div><span class="cnt"></span></div>
        <div class="ob14-hero">${rings}${gwHero}<span class="chip" style="border:1px solid #F4C2C7;background:#FFF7F8;color:#C22736"><span class="status-dot bad"></span>S3 当前离线</span></div>
        <div class="ob14-sheet">
          <div>
            <div style="display:flex;align-items:center;gap:6px"><span style="font-size:21px;font-weight:700;color:#14171C">通信配件 S3 当前离线</span>${stBadge('code')}</div>
            <div class="body" style="margin-top:5px">S3 离线时无法下发 LoRa 配对指令。请检查 S3 电源连接，或通过蓝牙重新配置 S3 网络。</div>
          </div>
          <div class="actions" style="margin:0">
            <button class="btn btn-secondary" data-act="provGw">重配 S3 Wi-Fi</button>
            <button class="btn btn-primary" data-act="s3RetryOnline">已上电，重新检测</button>
          </div>
        </div>
      </div>`;
    }

    if (s3 === 'online') {
      return `<div class="ob14">${statusbar()}
        <div class="ob14-nav"><button data-act="back" aria-label="返回">${ic('right', 'lg').replace('<svg', '<svg style="transform:scaleX(-1)"')}</button>
          <div class="t">S3–X5 LoRa 配对</div><span class="cnt"></span></div>
        <div class="ob14-hero">${rings}${gwHero}<span class="chip" style="border:1px solid #BCE3CE;background:#F3FAF6;color:#16794B"><span class="status-dot ok"></span>S3 已在线 · Home-5G</span></div>
        <div class="sheet-wrap" data-act="back">
          <div class="sheet">
            <div class="grab"></div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
              <h3 style="margin:0">检测到 S3 通信配件已在线</h3>${stBadge('code')}
            </div>
            <div class="t14-card" style="padding:11px 12px;margin-bottom:14px;display:flex;align-items:center;gap:11px">
              <span style="width:46px;height:36px;border-radius:9px;background:#fff;border:1px solid #DCE2E8;display:inline-flex;align-items:center;justify-content:center;flex:none">${GW_SVG}</span>
              <div style="flex:1;min-width:0">
                <div class="title" style="font-size:14px">通信配件 S3 · Home-5G</div>
                <div class="caption t14-num" style="margin-top:2px">SN TMW2026S3004231F0</div>
              </div>
              <span class="t14-badge ok">在线</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:9px">
              <button class="btn btn-primary" style="width:100%" data-act="loraStartPair">继续与 X5 进行 LoRa 配对</button>
              <button class="btn btn-secondary" style="width:100%" data-act="s3ChangeWifi">更换 S3 连接的 Wi-Fi</button>
              <button class="btn btn-secondary" style="width:100%;border-color:transparent;background:#F3F5F8;color:#5B6470" data-act="back">完成并退出</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    return `<div class="ob14">${statusbar()}
      <div class="ob14-nav"><button data-act="back" aria-label="返回">${ic('right', 'lg').replace('<svg', '<svg style="transform:scaleX(-1)"')}</button>
        <div class="t">S3–X5 LoRa 配对</div><span class="cnt t14-num">2/3</span></div>
      <div class="ob14-dots"><i class="done"></i><i class="on"></i><i></i></div>
      <div class="ob14-hero">${provRing14(68, 'lora', 'LoRa 配对中')}</div>
      <div class="ob14-sheet">
        <div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:21px;font-weight:700;color:#14171C">正在写入 LoRa 配对…</span>${stBadge('code')}
          </div>
          <div class="body" style="margin-top:5px">正在将 S3（31F0）配对码同步至 X5 主设备（8A21），可先离开，完成后在消息中心通知你。</div>
        </div>
        <div class="t14-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:9px">
          ${stepRow(true, false, '蓝牙验证 X5 主设备身份', 1)}
          ${stepRow(true, false, '写入 S3 通信配件频道参数', 2)}
          ${stepRow(false, true, '等待云端配对状态更新', 3)}
        </div>
        <div class="actions" style="margin:0">
          <button class="btn btn-secondary" data-act="provLeave">先回首页</button>
          <button class="btn btn-primary" data-act="loraPairDone">完成配对</button>
        </div>
      </div>
    </div>`;
  }

  /* 无设备空状态首页（1.4 银翼） */
  function renderEmptyHome14() {
    return `
    <div class="sub-page" style="background:radial-gradient(ellipse 95% 46% at 50% 24%, #FFFFFF 0%, #F1F4F8 58%, #E6EBF1 100%)">
      ${statusbar()}
      <div style="position:absolute;top:52px;left:20px;right:20px;display:flex;align-items:center;justify-content:space-between;z-index:6">
        <img src="${IMG}home/logo.png" alt="T-MOW" style="height:18px;width:auto">
        <button class="v3-sq-fab" data-act="messages" aria-label="消息中心">${ic('msg', 'sm')}${unread() ? `<span class="dot">${unread()}</span>` : ''}</button>
      </div>
      <div style="position:absolute;inset:96px 20px 76px;display:flex;flex-direction:column;justify-content:space-between">
        <div class="t14-card" style="padding:22px 18px 18px;display:flex;flex-direction:column;align-items:center;text-align:center">
          <img src="${IMG}add/device_product_large.png" alt="T-MOW 割草机器人" style="width:230px;height:auto;filter:drop-shadow(0 12px 18px rgba(17,19,23,.18))">
          <div class="pulse-line14" style="width:120px;margin:12px auto 14px"></div>
          <div style="font-size:21px;font-weight:700;color:#14171C;letter-spacing:-.02em">添加你的第一台割草机</div>
          <div class="caption" style="margin-top:6px;line-height:1.55">通过蓝牙连接设备并完成配网，约 3 分钟；内置 4G 模块将在绑定后自动激活服务。</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${ctaMain('provMower', ic('plus', 'sm'), '添加设备')}
        </div>
      </div>
      ${tabbar('home')}
    </div>`;
  }

  function renderGatewayS3() {
    const paired = ui.via === 'gw';
    return `
    <div class="sub-page">${nav('S3 通信配件' + stBadge('code'))}
      <div class="scroll">
        ${paired ? `
        <div class="t14-card" style="padding:14px;margin-top:6px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="width:52px;height:44px;border-radius:10px;background:#FFFFFF;border:1px solid #DCE2E8;display:flex;align-items:center;justify-content:center">${GW_SVG}</span>
            <div style="flex:1;min-width:0">
              <div class="title">S3 通信配件 · 尾号 <span class="t14-num">31F0</span></div>
              <div class="caption" style="margin-top:2px">已配对主设备：尾号 <span class="t14-num">8A21</span></div>
            </div>
            <span class="t14-badge ok">在线 · 已配对</span>
          </div>
          <div class="progress" style="margin-top:12px"><i style="width:88%"></i></div>
          <div class="caption t14-num" style="margin-top:6px">LoRa 信号强度：强（-62 dBm）· 上行通道：Wi-Fi Home-5G</div>
        </div>
        <div class="t14-gtitle">配件管理</div>
        <div class="group">
          ${cell('wifi', '更换 S3 Wi-Fi', 'Home-5G', 's3ChangeWifi')}
          ${cell('lora', '重新 LoRa 配对', '8A21', 'provLora')}
          ${cell('info', '安装位置建议', '开阔 ≥2m', 'openGwInstallSheet')}
          ${cell('close', '解绑当前 S3 配件', '', 'unbindS3', { danger: true })}
        </div>` : `
        <div class="t14-card" style="padding:22px 16px;text-align:center;margin-top:6px">
          <div style="width:64px;height:52px;margin:0 auto 10px;border-radius:12px;background:#FFFFFF;border:1px solid #DCE2E8;display:flex;align-items:center;justify-content:center">${GW_SVG}</div>
          <div class="title">暂无已绑定通信配件 S3</div>
          <div class="caption" style="margin-top:6px;line-height:1.5">庭院 Wi-Fi 信号较弱时，可添加 S3 通信配件并通过 LoRa 稳定中继连接。</div>
          <div style="margin-top:14px">${ctaMain('gwAdd', ic('plus', 'sm'), '立即添加 S3 通信配件')}</div>
        </div>`}
        <div class="caption" style="margin:10px 4px">支持主设备直连或通过 S3 通信配件中继联网，可在此更换 S3 网络或解绑重配。</div>
      </div>
    </div>`;
  }

  /* 1.4-5 真实 126 自检（4 大类 25 项位图 + 无固定超时 + 断连结果待确认 + 本地历史 + 清空） */
  const SC126_CATS = [
    { id: 'drive',  title: '驱动与行走系统', items: ['左轮驱动电机','右轮驱动电机','前万向轮编码器','轮速差分校准','底盘驱动板供电','CAN 动力总线'], bad: [] },
    { id: 'blade',  title: '刀盘与割草组件', items: ['刀盘主电机','刀盘霍尔测速','升降丝杠电机','高度限位传感','过流保护开关'], bad: [0] },
    { id: 'sensor', title: '安全与感知传感', items: ['前向碰撞梁','毫米波/超声波','雨水传感','双轴倾角仪','抬起微动开关','急停拍击开关','前双目相机','夜间补光灯'], bad: [6] },
    { id: 'comm',   title: '定位与通信链路', items: ['RTK/GNSS 模组','天线驻波检测','IMU 惯导校准','Wi-Fi 模组','BLE 蓝牙栈','S3 LoRa 链路'], bad: [0] },
  ];

  function renderSelfCheck126() {
    const ck = ui.ck || 'ok'; // ok | warn | fatal | running | disconnect
    const isHist = ui.scTab === 'history';
    if (isHist) {
      const hasHist = ui.data !== 'empty' && ui.scHistory.length > 0;
      return `
      <div class="sub-page">${nav('自检历史' + stBadge('code'), `<button class="r danger" data-act="scClearHist" ${hasHist ? '' : 'disabled'}>清空</button>`)}
        <div class="scroll">
          <div class="caption" style="margin:6px 4px 10px">仅保留本地落盘的 126 自检记录，支持清空或从「我的 → 清理缓存」一并重置。</div>
          ${hasHist ? `<div class="group">${ui.scHistory.map(h => `
            <div class="cell" style="cursor:default">
              <span class="ci">${ic('pulse2', 'sm')}</span>
              <span class="grow"><div class="title t14-num">${h.t}</div><div class="caption">${h.msg}</div></span>
              <span class="tag ${h.tone}">${h.label}</span>
            </div>`).join('')}</div>`
            : `<div class="t14-card empty-block" style="margin-top:4px">${emptyScene('rec')}<div class="title">暂无自检历史</div><div class="body">完成一次 126 设备自检后会保留在此，用于回溯硬件诊断记录。</div></div>`}
        </div>
      </div>`;
    }

    const total = 25;
    const errList = ck === 'fatal' ? ['刀盘主电机', '前双目相机', 'RTK/GNSS 模组'] : ck === 'warn' ? ['RTK/GNSS 模组'] : [];
    const pillCls = { ok: '', warn: 'warn', fatal: 'bad', running: 'idle', disconnect: 'warn' }[ck] || '';
    const pillTxt = { ok: '25/25 正常', warn: '1 项需注意', fatal: '3 项异常', running: '检测进行中…', disconnect: '断连 · 结果待确认' }[ck] || '正常';
    const summaryTitle = {
      ok: '全部项目通过 · 25 项检测正常',
      warn: '自检完成 · 1 项需注意（可继续作业）',
      fatal: '自检发现 3 项异常 · 建议排查',
      running: '126 指令已下发 · 等待设备逐项上报…',
      disconnect: '自检途中连接断开 · 结果待确认',
    }[ck];
    const summarySub = {
      ok: '最近同步 刚刚 · 本地历史已落盘',
      warn: 'RTK/GNSS 信号受遮挡，移至开阔草坪可提升精度',
      fatal: '请清理刀盘缠草与擦拭双目镜头后重新自检',
      running: '无固定超时上限，保持设备在电等待主动收敛或断线切换',
      disconnect: '设备可能仍在机内自检，待重新上线后同步最终位图结果',
    }[ck];

    return `
    <div class="sub-page">${nav('设备自检 126' + stBadge('code'), `<button class="r" data-act="scHistoryTab">历史</button>`)}
      <div class="scroll with-bar">
        <div class="diag14-deck">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="spec-badge14"><i class="tri"></i><span>126 BITMAP</span><span class="sep"></span><span class="t14-num">25 ITEMS</span></span>
            <span class="tag ${pillCls}">${pillTxt}</span>
          </div>
          <div class="diag14-stage">
            <img src="${IMG}device/device_selfcheck_product.png" alt="X5 自检">
            ${ck === 'fatal' ? `
              <span class="diag14-dot bad" style="left:50%;top:22%"></span><span class="diag14-callout" style="left:128px;top:16px">双目 / RTK 异常</span>
              <span class="diag14-dot bad" style="left:22%;top:50%"></span><span class="diag14-callout" style="left:-10px;top:120px">刀盘主电机异常</span>
            ` : ck === 'warn' || ck === 'disconnect' ? `
              <span class="diag14-dot warn" style="left:50%;top:22%"></span>
              <span class="diag14-dot ok" style="left:50%;top:54%"></span>
            ` : `
              <span class="diag14-dot ok" style="left:50%;top:22%"></span>
              <span class="diag14-dot ok" style="left:50%;top:52%"></span>
              <span class="diag14-dot ok" style="left:50%;top:78%"></span>
            `}
          </div>
          <div class="pulse-line14 ${ck === 'running' ? 'anim' : ''}"></div>
        </div>

        <div class="group pad" style="display:flex;align-items:center;justify-content:space-between;gap:10px">
          <div style="min-width:0">
            <div class="title" style="color:${ck === 'fatal' ? 'var(--color-state-danger)' : 'var(--color-text-primary)'}">${summaryTitle}</div>
            <div class="caption" style="margin-top:2px">${summarySub}</div>
          </div>
          <strong class="t14-num" style="font-size:18px;color:${ck === 'fatal' ? '#C22736' : ck === 'warn' ? '#8A5A00' : '#16794B'}">${total - errList.length}/${total}</strong>
        </div>

        ${SC126_CATS.map(cat => {
          const catBad = ck === 'fatal' ? cat.bad : (ck === 'warn' && cat.id === 'comm' ? [0] : []);
          const exp = ui.scExp?.[cat.id] !== false;
          return `
          <div class="diag14-cat">
            <button class="diag14-cat-head" data-act="scToggleCat" data-c="${cat.id}">
              <div>
                <div class="title">${cat.title}</div>
                <div class="caption">${cat.items.length - catBad.length} 项正常${catBad.length ? ` · <b style="color:#C22736">${catBad.length} 项异常</b>` : ''}</div>
              </div>
              <span class="tag ${catBad.length ? (ck === 'warn' ? 'warn' : 'bad') : ''}">${catBad.length ? '异常' : '正常'}</span>
            </button>
            ${exp ? `<div class="diag14-grid">${cat.items.map((n, idx) => {
              const bad = catBad.includes(idx);
              return `<div class="diag14-item ${bad ? 'bad' : ''}"><span class="online ${bad ? '' : ''}" style="background:${bad ? '#C22736' : ck === 'running' ? '#8A94A2' : '#189558'}"></span><span>${n}</span></div>`;
            }).join('')}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
      <div class="bottom-bar">
        <button class="btn btn-secondary" data-act="scSimNext">切换异常态</button>
        <button class="btn btn-primary" data-act="ckRetry">${ck === 'running' ? '自检进行中…' : '重新发起 126 自检'}</button>
      </div>
    </div>`;
  }

  /* 1.4-6 OTA 升级列表与两阶段详情（含 4 项前置门禁校验） */
  function otaGateReason() {
    if (ui.state === 'offline') return '设备离线，上线后才能发起 OTA';
    if (ui.otaPre === 'mowing') return '设备正在割草或非待机/充电态，请先暂停并回到充电桩';
    if (ui.otaPre === 'lowbat') return '设备当前电量 36%（低于 50%），请先充电至 50% 以上再升级';
    if (ui.otaPre === 'blade') return '刀盘仍在转动，存在安全风险，请先停止刀盘后再升级';
    return '';
  }

  function renderOtaList14() {
    const st = ui.otaSt, busy = ['starting', 'downloading', 'upgrading', 'rebooting'].includes(st);
    const labelMap = {
      available: `${ui.otaForce ? '<span class="tag bad" style="margin-right:4px">强制</span>' : ''}1.5.0`,
      starting: '校验中…', downloading: `下载 ${ui.otaProg}%`, upgrading: `安装 ${ui.otaProg}%`,
      rebooting: '重启中(8)', rollingBack: '回滚中(9)', checkFailed: '检查失败',
      success: '已是最新', failed: '升级失败', timedOut: '升级超时', invalid: '已失效',
    };
    return `
    <div class="sub-page">${nav('设备升级' + stBadge('code'))}
      <div class="scroll">
        <div class="group pad" style="display:flex;align-items:center;gap:12px;margin-top:6px">
          <img src="${IMG}device/device_selfcheck_product.png" alt="" style="width:46px;height:46px;object-fit:contain">
          <div style="flex:1"><div class="title">${DEVICES[ui.deviceIdx]}</div><div class="caption">支持主控、底盘与通信模块固件在线升级</div></div>
        </div>
        <div class="group" style="margin-top:10px">
          <button class="cell" data-act="otaFw">
            <span class="ci">${ic('upgrade', 'sm')}</span>
            <span class="grow"><div class="title">设备主机固件${ui.otaForce ? '（强制更新）' : ''}</div><div class="caption">当前 ${st === 'success' ? '1.5.0' : '1.4.2'}</div></span>
            <span class="val">${labelMap[st] || '检查'}</span><span class="chev">${ic('right', 'sm')}</span>
          </button>
          ${busy ? `<div style="padding:0 16px 12px"><div class="progress"><i style="width:${ui.otaProg}%"></i></div></div>` : ''}
          <div class="cell" style="cursor:default"><span class="ci">${ic('lora', 'sm')}</span><span class="grow"><div class="title">MCU 底盘控制器</div><div class="caption">当前 V1.12.04</div></span><span class="val">已是最新</span></div>
          <div class="cell" style="cursor:default"><span class="ci">${ic('wifi', 'sm')}</span><span class="grow"><div class="title">S3 通信配件固件</div><div class="caption">当前 V2.1.0</div></span><span class="val">已是最新</span></div>
        </div>
      </div>
    </div>`;
  }

  function renderOtaFw14() {
    const st = ui.otaSt, gate = otaGateReason();
    const busy = ['starting', 'downloading', 'upgrading', 'rebooting'].includes(st);
    const phaseTxt = st === 'downloading' ? `第一阶段：正在下载固件包 ${ui.otaProg}%`
      : st === 'upgrading' ? `第二阶段：写入主板与模组 ${ui.otaProg}%`
      : st === 'rebooting' ? '状态 8 · 设备正在安全重启生效…'
      : st === 'rollingBack' ? '状态 9 · 安装校验未通过，正在自动回滚至 V1.4.2…'
      : st === 'checkFailed' ? '检查更新失败，请检查网络连接后重试'
      : st === 'success' ? 'V1.5.0 已生效并完成重启校验'
      : st === 'failed' ? '升级失败，可重新发起升级'
      : st === 'timedOut' ? '升级轮询超时，请靠近设备确认状态'
      : st === 'invalid' ? '升级任务已失效'
      : '下载固件包并写入设备，全程约 3–5 分钟';

    const btnTxt = busy ? '升级进行中（可安全返回）'
      : st === 'checkFailed' ? '重新检查更新'
      : st === 'success' ? '完成'
      : ['failed', 'timedOut', 'rollingBack'].includes(st) ? '重新升级'
      : '下载并升级';

    const otaPct = st === 'success' ? 100 : st === 'rebooting' ? 98 : Number(ui.otaProg || 0);
    const otaTag = st === 'success' ? '升级已完成' : st === 'downloading' ? '下载固件中' : st === 'upgrading' ? '写入升级中' : st === 'rebooting' ? '安全重启中' : '等待升级';
    return `
    <div class="sub-page">${nav('固件升级详情' + stBadge('code'))}
      <div class="scroll with-bar">
        <div class="group pad" style="text-align:center;margin-top:6px">
          <div class="title">${DEVICES[ui.deviceIdx]} · 主机固件 V1.4.2 → V1.5.0</div>
          <div style="margin:18px auto;display:flex;justify-content:center">${provRing14(otaPct, 'upgrade', otaTag)}</div>
          <div class="title" style="color:${['failed','timedOut','rollingBack','checkFailed'].includes(st) ? '#C22736' : st === 'success' ? '#16794B' : '#14171C'}">${phaseTxt}</div>
          <div class="caption" style="margin-top:4px">${ui.otaForce ? '强制升级版本：跳过提示限制，立即启动更新' : '建议保持设备在充电桩上且勿断电'}</div>
        </div>
        <div class="gtitle">V1.5.0 更新内容</div>
        <div class="group bul">
          <div>优化区域边界转角平滑度，提升高草通过效率</div>
          <div>支持 25 项完整设备自检状态上报</div>
          <div>增强 S3 LoRa 弱网链路与断开自重连稳定性</div>
        </div>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-primary" ${busy ? 'disabled' : ''} data-act="${st === 'success' ? 'back' : st === 'checkFailed' ? 'otaRecheck' : 'otaRun14'}">${btnTxt}</button>
      </div>
    </div>`;
  }

  /* 1.4-8 设备信息 & 我的二级页（帮助反馈 / 隐私说明 / 系统权限 / 关于） */
  function renderDevInfo14() {
    const owner = ui.role === 'owner';
    const row = (k, v, act = '') => `<button class="tz-row" ${act ? `data-act="${act}"` : ''}><span class="grow">${k}</span><span class="body t14-num">${v}</span>${act ? `<span class="chev idle">${ic('right', 'sm')}</span>` : ''}</button>`;
    return `
    <div class="sub-page">${nav('设备信息' + stBadge('code'))}
      <div class="scroll">
        <div class="group" style="margin-top:6px">
          ${row('设备名称', DEVICES[ui.deviceIdx], owner ? 'rename' : '')}
          ${row('设备型号', 'T-MOW X5')}
          ${row('序列号 SN', 'TMW2026A0018')}
          ${row('MAC 地址', 'DC:2E:97:36:76:ED')}
          ${row('硬件版本', 'HW-V2.1')}
        </div>
        <div class="gtitle">分模块固件版本</div>
        <div class="group">
          ${row('主控与应用固件', 'V1.4.2-202611')}
          ${row('底盘 MCU 固件', 'MCU-1.12.04')}
          ${row('视觉感知与定位', 'VIS-0.9.8')}
        </div>
        <div class="gtitle">连接与配件</div>
        <div class="group">
          ${row('通信配件 S3 LoRa', ui.via === 'gw' ? '已配对 · 31F0' : '未配置', 'gateway')}
          ${row('设备直连 Wi-Fi', 'Home-5G', 'changeWifi')}
          ${row('最后在线', '刚刚')}
        </div>
      </div>
    </div>`;
  }

  function renderProfile14() {
    return `
    <div class="tab-page">${statusbar()}
      <div class="tab-head"><span class="display">我的</span><img class="logo" src="${IMG}home/logo.png" alt="T-MOW" style="height:15px"></div>
      <div class="tab-scroll">
        <button class="me" style="margin-top:4px;width:100%;text-align:left" data-act="account">
          <span class="avatar lg">O</span>
          <span class="grow" style="flex:1"><div class="title">${ui.nick}</div><div class="caption" style="margin-top:2px">owner@xx.com · 个人设置与地区单位</div></span>
          <span class="chev idle">${ic('right', 'sm')}</span>
        </button>
        <div class="gtitle">通用设置</div>
        <div class="group">
          ${cell('globe', 'App 语言', ui.lang, 'langSheet')}
          ${cell('clock', '时区', ui.autoTz ? '自动 · 洛杉矶' : '手动 · 纽约', 'timezone')}
          ${cell('lock', '系统权限管理' + stBadge('code'), '蓝牙 / 定位 / 相机', 'goAppPerms')}
        </div>
        <div class="gtitle">支持与关于 ${stBadge('code')}</div>
        <div class="group">
          ${cell('help', '帮助与反馈', 'FAQ / 提交工单', 'goHelpFeedback')}
          ${cell('shield', '隐私说明', '数据与权限合规', 'goPrivacyDoc')}
          ${cell('upgrade', '检查 App 更新', 'v1.4.0', 'checkAppUpdate')}
          ${cell('rotate', '清理本地缓存', ui.cacheMb, 'clearAppCache')}
          ${cell('info', '关于 T-MOW', 'v1.4.0', 'goAboutApp')}
        </div>
        <div class="group" style="margin-top:14px"><button class="tz-row" data-act="logout" style="justify-content:center"><span class="danger-text title">退出登录</span></button></div>
      </div>${tabbar('profile')}
    </div>`;
  }

  function renderProfileSubPage(page) {
    if (page === 'helpFeedback') {
      return `<div class="sub-page">${nav('帮助与反馈' + stBadge('code'))}
        <div class="scroll">
          <div class="gtitle">高频问题自助排查</div>
          <div class="group">
            ${cell('wifi', '设备离线或配网连不上 Wi-Fi', '2.4G 频段与路由器限制说明', 'noop')}
            ${cell('lora', 'S3 通信配件 LoRa 配对失败', '间距检查与天线方向', 'noop')}
            ${cell('dock', '无法回到充电桩', '桩前 1.5m 净空要求', 'noop')}
          </div>
          <div class="gtitle">意见反馈</div>
          <div class="group pad">
            <div class="caption" style="margin-bottom:8px">问题发生设备：${DEVICES[ui.deviceIdx]}（自动附带最近 126 自检摘要，不含敏感凭据）</div>
            <button class="btn btn-primary" style="width:100%" data-act="submitFeedback">提交日志与反馈</button>
          </div>
        </div></div>`;
    }
    if (page === 'privacyDoc') {
      return `<div class="sub-page">${nav('隐私说明' + stBadge('code'))}
        <div class="scroll"><div class="group bul">
          <div>登录凭据与刷新令牌仅存入系统加密存储（Keychain / Keystore），不会写入普通偏好设置或日志。</div>
          <div>蓝牙配网阶段提交的家庭 Wi-Fi 密码全链路脱敏且不在控制台输出明文。</div>
          <div>庭院边界、禁区坐标与作业轨迹仅归属当前家庭主人及授权成员访问。</div>
        </div></div></div>`;
    }
    if (page === 'appPerms') {
      return `<div class="sub-page">${nav('系统权限管理' + stBadge('code'))}
        <div class="scroll"><div class="group">
          ${cell('bt', '蓝牙权限', '已授权 · 用于配网与近场控制', 'noop')}
          ${cell('locate', '位置服务权限', '已授权 · Android 蓝牙扫描必需', 'noop')}
          ${cell('qr', '相机权限', '使用时询问 · 扫描 X5 二维码', 'noop')}
          ${cell('msg', '通知权限', '已授权 · 告警与 OTA 完成提醒', 'noop')}
        </div></div></div>`;
    }
    if (page === 'aboutApp') {
      return `<div class="sub-page">${nav('关于 T-MOW' + stBadge('code'))}
        <div class="scroll"><div class="group pad" style="text-align:center;padding:28px 20px">
          <img src="${IMG}home/logo.png" alt="T-MOW" style="height:26px;margin:0 auto 10px">
          <div class="caption">智能庭院割草机器人控制端</div>
          <div class="title t14-num" style="margin-top:8px">Version 1.4.0 (Build 140)</div>
          <div class="pulse-line14" style="width:120px;margin:14px auto"></div>
          <div class="caption">仅使用品牌 LOGO 与实机设计语言 · © 2026 T-MOW Robotics</div>
        </div></div></div>`;
    }
    return '';
  }

  /* =========================================================
     模块四补充弹层与全部 1.4 页面挂载（含四大模块）
     ========================================================= */
  /* 模块一：配对绑定（扫码添加 scanAdd / 常规与网关配网 prov） */
  function renderScanAdd14() {
    return `
    <div class="sub-page">${nav('扫码添加' + stBadge('code'))}
      <div class="scroll">
        <div class="scan14-bezel" style="margin-top:4px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <span class="spec-badge14"><i class="tri"></i><span>QR SCAN</span><span class="sep"></span><span>X5 / S3</span></span>
            <span class="t14-badge">支持云端校验 SN</span>
          </div>
          <div class="scan14-view" data-act="scanFound" style="cursor:pointer" title="点击模拟扫码识别设备并连接">
            <div class="scan14-reticle"><b></b><b></b><b></b><b></b><span class="scan14-beam"></span></div>
            <div style="position:relative;z-index:2;padding:5px 12px;border-radius:999px;background:rgba(20,23,28,.55);color:#fff;font-size:11.5px;backdrop-filter:blur(6px)">对准机身或包装上的二维码</div>
          </div>
        </div>
        <div class="caption" style="text-align:center;margin:14px 4px 18px;line-height:1.55">识别后自动校验 SN 绑定状态与设备固件状态，直接进入蓝牙配网引导。</div>

        <div style="margin-top:8px">
          ${ctaMain('manualSn', ic('edit', 'sm'), '手动输入设备 SN')}
        </div>
      </div>
    </div>`;
  }

  function renderProv14() {
    const steps = PROV_STEPS(), step = steps[ui.provStep] || 'guide', mower = ui.provKind === 'mower';
    const pairing = step.startsWith('pair');
    const MOWER_IMG = `<img class="dev" src="${IMG}add/device_product_large.png" alt="割草机">`;
    const GW_IMG = GW_SVG.replace('<svg', '<svg class="dev gw"');
    const rings = radarRings14();
    const lead = (h, sub) => `<div><div style="font-size:21px;font-weight:700;color:#14171C;letter-spacing:-.02em;line-height:1.25">${h}</div>${sub ? `<div class="body" style="margin-top:5px">${sub}</div>` : ''}</div>`;
    const list = items => `<div class="t14-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:9px">${items.map((t, i) => `<div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.45"><span class="t14-num" style="width:20px;height:20px;border-radius:6px;background:#1E232B;color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:none;margin-top:1px">${i + 1}</span><span style="color:#14171C">${t}</span></div>`).join('')}</div>`;
    const link = (t, b, act) => `<button class="link" style="font-size:12.5px;color:#5B6470;height:28px" data-act="${act}">${t}${b ? ` <b style="color:#14171C">${b}</b>` : ''}</button>`;
    const devCard = (isMower, bad = false, extra = '') => `<div class="t14-card" style="padding:12px;display:flex;align-items:center;gap:12px;${bad ? 'border-color:#F4C2C7;background:#FFF7F8' : 'border-color:#1E232B;background:#FFFFFF'}">
      <span style="width:58px;height:44px;border-radius:10px;background:#fff;border:1px solid #DCE2E8;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none">${isMower ? `<img src="${IMG}add/device_product_large.png" alt="" style="width:52px;height:auto">` : GW_SVG}</span>
      <span style="flex:1;min-width:0"><div class="title">${isMower ? 'T-MOW 割草机' : '通信网关 S3'}</div><div class="caption t14-num" style="margin-top:2px">SN ${isMower ? 'TMW2026X500918A21' : 'TMW2026S3004231F0'} · 信号强</div>${extra}</span>
      ${bad ? `<span class="t14-badge bad">已被绑定</span>` : `<span style="width:22px;height:22px;border-radius:6px;background:#1E232B;color:#fff;display:inline-flex;align-items:center;justify-content:center">${ic('check', 'sm')}</span>`}</div>`;

    let hero = '', sheet = '';
    if (step === 'guide' || step === 'pairGuide') {
      const isMower = mower || pairing;
      hero = `${rings}${isMower ? MOWER_IMG : GW_IMG}<span class="chip" style="border:1px solid #DCE2E8"><i class="blue-led slow"></i>指示灯慢闪</span>`;
      sheet = isMower
        ? `${lead(pairing ? '让割草机进入配对状态' : '让割草机进入配网状态', pairing ? '网关联网成功，接下来配对割草机。' : '')}
           ${list(['打开割草机电源开关', '长按机身配网键约 3 秒', '看到指示灯蓝色慢闪后点击下一步'])}
           <div class="ob-act">${ctaMain('provNext', ic('bt', 'sm'), '指示灯已在慢闪')}<button class="btn btn-secondary" style="width:100%" data-act="scanAdd">${ic('qr', 'sm')}扫码配网</button>${link('指示灯没有闪？', '查看排查', 'addHelp')}</div>`
        : `${lead('接通通信网关电源')}
           ${list(['插上电源适配器，网关自动开启蓝牙', '若用有线网络，请先插上网线', '放置于开阔区域（建议距遮挡 ≥2m）'])}
           <div class="ob-act">${ctaMain('provNext', ic('bt', 'sm'), '指示灯已在慢闪')}${link('查看', '安装位置建议', 'openGwInstallSheet')}</div>`;
    } else if (step === 'discover' || step === 'pairDiscover') {
      const isMower = mower || pairing, f = ui.found;
      const bound = !pairing && ui.provResult === 'bound';
      const snMismatch = !pairing && ui.provResult === 'snMismatch';
      hero = `${rings}${radarSweep14()}<span class="core">${ic(pairing ? 'wifi' : 'bt', 'lg')}</span>
        ${f ? `<span class="found" style="left:calc(50% + 60px);top:calc(50% - 92px);border:1.5px solid #F08300">${isMower ? `<img src="${IMG}add/device_product_large.png" alt="">` : GW_SVG}</span>` : ''}`;
      const who = isMower ? '割草机' : '通信网关';
      sheet = !f
        ? `${lead(pairing ? '网关正在寻找割草机…' : `正在寻找附近的${who}…`, pairing ? '请让割草机靠近网关并保持指示灯闪烁。' : '请将手机靠近设备并保持蓝牙开启。')}
           <div class="ob-act">${ctaMain('', '<span class="spin"></span>', '蓝牙扫描中…', '', true)}${link('找不到？', '改用扫码添加', pairing ? 'noop' : 'scanAdd')}</div>`
        : snMismatch
        ? `${lead('配对失败 · SN 不一致', '蓝牙扫描返回的设备 SN 与扫码得到的 SN 不匹配。')}
           ${devCard(isMower, true, `<div class="caption danger-text t14-num" style="margin-top:2px">期望 SN：TMW2026X500918A21 · 实际：TMW2026X500919F04</div>`)}
           <div class="ob-act">${ctaMain('provRescan', ic('rotate', 'sm'), '重新搜索设备')}${link('返回', '重新扫码', 'scanAdd')}</div>`
        : bound
        ? `${lead('这台设备已被绑定', '它属于另一个账号，需原主人解绑后才可添加。')}
           ${devCard(isMower, true, `<div class="caption danger-text" style="margin-top:2px">已绑定到 ann@xx.com</div>`)}
           <div class="caption">请原主人在 App「设备设置 → 解绑设备」；或长按机身复位键 10 秒恢复出厂。</div>
           <div class="ob-act">${ctaMain('provRecheck', ic('check', 'sm'), '我已处理，重新检测')}${link('了解', '解绑与恢复出厂', 'addHelp')}</div>`
        : `${lead(`发现 1 台${who}`, '请核对机身铭牌上的完整 SN 序列号。')}${devCard(isMower)}
           <div class="ob-act">${ctaMain('provNext', ic('check', 'sm'), pairing ? '连接这台割草机' : '连接这台设备')}${link('不是这台？', '重新搜索', 'provRescan')}</div>`;
    } else if (step === 'bleConnect') {
      hero = `${rings}${MOWER_IMG}<span class="chip" style="border:1px solid #DCE2E8"><span class="spin" style="width:12px;height:12px"></span>蓝牙连接中…</span>`;
      sheet = `${lead('正在连接割草机蓝牙…', '请保持手机靠近设备，连上蓝牙后即可进入 Wi-Fi 配置。')}
        <div class="t14-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:9px">
          <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#14171C"><span style="width:20px;height:20px;border-radius:6px;background:#1E232B;color:#fff;display:inline-flex;align-items:center;justify-content:center">${ic('check', 'sm')}</span><span style="flex:1">校验设备 SN 身份</span></div>
          <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#14171C"><span style="width:20px;height:20px;border-radius:6px;background:#FFF3E3;color:#F08300;display:inline-flex;align-items:center;justify-content:center"><span class="spin" style="width:11px;height:11px"></span></span><span style="flex:1">建立蓝牙加密通信通道</span></div>
        </div>
        <div class="ob-act">${ctaMain('', '<span class="spin"></span>', '蓝牙连接中…', '', true)}${link('等待过久？', '重新搜索设备', 'provBack')}</div>`;
    } else if (step === 'wifi') {
      const gw = !mower, wired = gw && ui.gwWired === 'wired';
      hero = `${rings}${pairingFlow14(wired)}`;
      sheet = `${lead(wired ? '使用有线网络' : '连接 Wi-Fi', wired ? '检测到网线接入，网关将优先通过以太网连接云端。' : mower ? '已自动读取当前手机 Wi-Fi 信息，可核对密码后直连。' : '选择通信网关要连接的家庭网络。')}
        ${gw ? `<div class="seg"><button class="${wired ? 'on' : ''}" data-act="gwWired">网线</button><button class="${wired ? '' : 'on'}" data-act="gwWifi">Wi-Fi</button></div>` : ''}
        ${wired ? `<div class="t14-card" style="padding:12px 14px;display:flex;align-items:center;gap:10px"><span class="ok">${ic('cable')}</span><span class="grow title">网线已连接</span><span class="t14-badge ok">优先通道</span></div>`
        : `<div class="auth14-box"><span class="caption" style="width:36px;flex:none">网络</span><span class="grow title" style="flex:1;min-width:0;font-size:14px">Home-5G</span><span class="idle" style="display:inline-flex;align-items:center;gap:8px;flex:none">${ic('wifi', 'sm')}<button class="t14-keypill" style="height:26px;padding:0 9px;font-size:11px" data-act="noop">切换</button></span></div>
           <div class="auth14-box"><span class="caption" style="width:36px;flex:none">密码</span><span class="grow t14-num" style="flex:1;min-width:0;font-size:14px;letter-spacing:${ui.pwdShown ? 0 : 2}px">${ui.pwdShown ? 'garden2026' : '••••••••••'}</span><button data-act="pwdEye" aria-label="显示密码" class="idle" style="flex:none;display:inline-flex;align-items:center;justify-content:center">${ic('eye', 'sm')}</button></div>`}
        <div class="ob-act">${ctaMain('provNext', ic('wifi', 'sm'), wired ? '下一步' : '连接网络')}${wired ? '' : link('连不上？', '常见路由器设置', 'routerHelp')}</div>`;
    } else if (step === 'result' || step === 'pairResult') {
      const st = pairing ? ['割草机信息发送到网关', '网关与割草机配对'] : STAGES();
      const failAt = pairing ? -1 : (FAIL_AT[ui.provResult] ?? -1);
      const isTimeout = !pairing && ui.provResult === 'timeout';
      const failed = isTimeout || (failAt >= 0 && ui.provProg === failAt);
      const finished = !isTimeout && ui.provProg >= st.length;
      const last = finished && (pairing || ui.provKind === 'mower' || ui.gwMower !== 'none');
      const row = (t, i) => {
        const c = isTimeout ? (i === 0 ? 'ok' : i === 1 ? 'bad' : 'wait') : i < ui.provProg ? 'ok' : i === ui.provProg ? (i === failAt ? 'bad' : 'run') : 'wait';
        const badge = c === 'ok' ? `<span style="width:20px;height:20px;border-radius:6px;background:#1E232B;color:#fff;display:inline-flex;align-items:center;justify-content:center">${ic('check', 'sm')}</span>`
          : c === 'bad' ? `<span style="width:20px;height:20px;border-radius:6px;background:#C22736;color:#fff;display:inline-flex;align-items:center;justify-content:center">${ic('close', 'sm')}</span>`
          : c === 'run' ? `<span style="width:20px;height:20px;border-radius:6px;background:#FFF3E3;color:#F08300;display:inline-flex;align-items:center;justify-content:center"><span class="spin" style="width:11px;height:11px"></span></span>`
          : `<span class="t14-num" style="width:20px;height:20px;border-radius:6px;background:#E6EBF1;color:#7F8996;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">${i + 1}</span>`;
        return `<div style="display:flex;align-items:center;gap:10px;font-size:13px;color:${c === 'wait' ? '#8A94A2' : '#14171C'}">${badge}<span style="flex:1">${t}</span></div>`;
      };
      const FAIL = {
        pwd: ['连不上家庭 Wi-Fi', '密码错误或当前位置信号过弱，请核对后重输。', '重新输入密码', 'provBackWifi', 'Wi-Fi 连接失败'],
        cloud: ['已联网，但连不上云端', '路由器可能限制了外网访问，或云端暂不稳定。', '重试连接', 'provRetry', '云端连接异常'],
        timeout: ['配对已超时', '等待云端与设备回执超时，请重新触发绑定流程。', '重新配对', 'provRetry', '配对响应超时'],
      };
      const f = FAIL[ui.provResult] || FAIL.cloud;
      const failRings = `<img class="rings radar-fail14" src="${IMG}add/background_add_device.png" alt="">`;
      hero = finished ? `${rings}${(pairing || mower) ? MOWER_IMG : GW_IMG}<span class="chip" style="border:1px solid #1E232B;background:#FFFFFF;color:#14171C">${ic('check', 'sm')}添加成功</span>`
        : failed ? `${failRings}${(pairing || mower) ? MOWER_IMG : GW_IMG}<span class="chip" style="border:1px solid #F4C2C7;background:#FFF7F8;color:#C22736"><span class="status-dot bad"></span>${f[4]}</span>`
        : provRing14(Math.round(ui.provProg / st.length * 100), pairing ? 'lora' : 'wifi', pairing ? 'LoRa 配对中' : '正在连接网络');

      if (finished && ui.reWifi) {
        sheet = `${lead('Wi-Fi 已更换', '设备已重新上线；绑定关系、地图、定时与设置全部保留。')}${ctaMain('wifiDone', ic('check', 'sm'), '完成并返回')}`;
      } else if (finished && last) {
        sheet = `${lead(pairing ? '网关与割草机均已就绪' : '设备添加成功', '为设备起一个好记的名字，方便多机区分。')}
          <div class="auth14-box">${ic('edit', 'sm')}<span class="grow title" style="font-size:14px">${ui.devName}</span></div>
          <div class="ob-names">${['后院割草机', '前院割草机', '花园割草机'].map(x => `<button class="${ui.devName === x ? 'on' : ''}" style="${ui.devName === x ? 'background:#1E232B;color:#fff' : ''}" data-act="pickName" data-n="${x}">${x}</button>`).join('')}</div>
          <div class="caption">内置 4G 备用网络默认关闭，可在「设备设置 → 4G 备用网络」随时开启。</div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-secondary" style="flex:none;width:92px" data-act="provFinish">稍后</button>
            ${ctaMain('provMap', ic('map', 'sm'), '开始建图')}
          </div>`;
      } else if (finished) {
        sheet = `${lead('网关已联网', '通信网关已入网，还差一步：绑定一台割草机。')}
          <div class="ob-act">${ctaMain('provNext', ic('lora', 'sm'), '继续配对割草机')}${link('稍后再连', '', 'provLeave')}</div>`;
      } else if (failed) {
        sheet = `${lead(f[0], f[1])}
          <div class="t14-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:9px">${st.map(row).join('')}</div>
          <div class="ob-act">${ctaMain(f[3], ic(ui.provResult === 'pwd' ? 'wifi' : 'rotate', 'sm'), f[2])}${link('', '查看路由器设置帮助', 'routerHelp')}</div>`;
      } else {
        sheet = `${lead(pairing ? '正在配对割草机…' : '正在连接网络…', pairing ? '最长约 7 分钟，可以先离开，完成后会在消息中心通知你。' : '大约 1–2 分钟，请保持手机与设备靠近路由器。')}
          <div class="t14-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:9px">${st.map(row).join('')}</div>
          ${pairing ? `<div class="ob-act">${link('先去首页等待结果', '', 'provLeave')}</div>` : ''}`;
      }
    }

    const n = steps.length;
    return `<div class="ob14">${statusbar()}
      <div class="ob14-nav"><button data-act="provBack" aria-label="返回">${ic('right', 'lg').replace('<svg', '<svg style="transform:scaleX(-1)"')}</button>
        <div class="t">${pairing ? '连接割草机' : ui.reWifi ? '更换 Wi-Fi' : mower ? '添加割草机' : '添加通信网关'}</div>
        <span class="cnt t14-num">${ui.provStep + 1}/${n}</span></div>
      <div class="ob14-dots">${steps.map((_, i) => `<i class="${i === ui.provStep ? 'on' : i < ui.provStep ? 'done' : ''}"></i>`).join('')}</div>
      <div class="ob14-hero">${hero}</div>
      <div class="ob14-sheet">${sheet}</div>
    </div>`;
  }

  /* 模块二：设备建图与地图流程（引导页 1~2 → 5 项建图前准备 → 横屏建图 → 横屏地图编辑） */
  function renderMapGuidePage(step) {
    const is1 = step === 1;
    const svg1 = `<svg viewBox="0 0 280 176" fill="none">
      <rect width="280" height="176" rx="14" fill="#EAF4E7"/>
      <path d="M24 38 Q95 22 178 34 T256 46 L248 142 Q156 154 32 138 Z" fill="#BCE1AE" stroke="#199459" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M138 92 L218 46 A92 92 0 0 1 226 122 Z" fill="rgba(240,131,0,0.18)" stroke="#F08300" stroke-width="1.4" stroke-dasharray="3 3"/>
      <rect x="116" y="78" width="38" height="26" rx="7" fill="#1E232B"/><rect x="128" y="83" width="14" height="8" rx="2" fill="#F08300"/>
    </svg>`;
    const svg2 = `<svg viewBox="0 0 280 176" fill="none">
      <rect width="280" height="176" rx="14" fill="#EDF3F9"/>
      <rect x="20" y="28" width="240" height="122" rx="12" fill="#D4EBC8" stroke="#92BD84" stroke-width="1.5"/>
      <rect x="216" y="68" width="28" height="36" rx="6" fill="#FFFFFF" stroke="#1E232B" stroke-width="2"/>
      <path d="M230 78l-4 7h4l-1.5 7 5.5-8h-4z" fill="#199459"/>
      <path d="M204 86 H146" stroke="#F08300" stroke-width="2.5" stroke-dasharray="5 4"/>
      <path d="M154 80 L144 86 L154 92" stroke="#F08300" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="98" y="73" width="38" height="26" rx="7" fill="#1E232B"/><rect x="110" y="78" width="14" height="8" rx="2" fill="#F08300"/>
      <text x="166" y="132" font-size="11" fill="#365A32" font-weight="700">桩前 3m 无遮挡 · 30m 有参照</text>
    </svg>`;
    return `
    <div class="sub-page">${nav('新建地图引导', `<span class="caption t14-num">${step}/2</span>`)}
      <div class="scroll with-bar">
        <div class="guide14-hero" style="margin-top:8px">
          ${is1 ? svg1 : svg2}
          <div style="font-size:21px;font-weight:700;color:#14171C;margin-top:18px">${is1 ? '建图是什么' : '充电桩'}</div>
          <div class="body" style="margin-top:8px;line-height:1.6;color:#5B6470">${is1
            ? '定义割草作业区域。支持 Robot 自主探索建图，或遥控绘制草坪边界。'
            : 'Robot 空闲时的停泊点，作业中的能量补给站。'}</div>
          ${is1 ? '' : `<div class="t14-card" style="width:100%;padding:12px 14px;margin-top:14px;text-align:left;font-size:12.5px;line-height:1.55;color:#14171C">
            <div>• 充电桩周围 30 m 内有可识别的参照物（如树、花床或建筑）</div>
            <div style="margin-top:4px">• 充电桩前 3 m 内无障碍物，留出安全退桩空间</div>
          </div>`}
        </div>
      </div>
      <div class="bottom-bar">${ctaMain(is1 ? 'mapGuideNext' : 'toMapPrecheck', ic('right', 'sm'), '下一步')}</div>
    </div>`;
  }

  function renderMapPrecheckPage() {
    const pre = ui.pre || 'ok';
    const checks = [
      { label: '电量 ≥ 50%', bad: pre === 'low', val: pre === 'low' ? '32% 偏低' : '86%', tip: '当前电量仅 32%，请充电至 50% 以上再建图' },
      { label: '充电桩状态', bad: pre === 'offdock', val: pre === 'offdock' ? '未在桩上' : '已在充电桩', tip: '设备不在充电桩上，请先放回充电桩后再开始' },
      { label: '蓝牙连接', bad: pre === 'bt', val: pre === 'bt' ? '未连接' : '已连接', tip: '请打开手机蓝牙并靠近割草机后重试' },
      { label: 'RTK 定位信号', bad: pre === 'rtk', val: pre === 'rtk' ? '未连接' : '固定解', tip: 'RTK 基站未连接，请检查供电与视野开阔度' },
      { label: '设备自检', bad: ui.ck === 'fatal', val: ui.ck === 'fatal' ? '存在异常' : '25 项正常', tip: '设备自检存在异常项，请先在「设备自检」排查' },
    ];
    const badItems = checks.filter(x => x.bad);
    const okCount = checks.length - badItems.length;
    return `
    <div class="sub-page">${nav('建图前准备')}
      <div class="scroll with-bar">
        <div class="diag14-deck" style="margin-top:6px;padding:14px 16px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="spec-badge14"><i class="tri"></i><span>PRECHECK</span><span class="sep"></span><span class="t14-num">${okCount}/5</span></span>
            <span class="t14-badge ${badItems.length ? 'warn' : 'ok'}">${badItems.length ? `${badItems.length} 项待处理` : '一切就绪'}</span>
          </div>
          <div class="precheck14-stage">
            <div class="precheck14-halo"></div>
            <img src="${IMG}add/device_product_large.png" alt="T-MOW 割草机">
            <div class="precheck14-shadow"></div>
          </div>
          <div class="pulse-line14"></div>
        </div>
        ${badItems.length ? `<div style="margin-bottom:10px">${alertBox14('warn', 'alert', `需先处理「${badItems[0].label}」`, badItems[0].tip)}</div>` : ''}
        <div class="group" style="margin-top:0">
          ${checks.map(x => `
          <div class="cell" style="cursor:default;min-height:48px">
            <span style="width:24px;height:24px;border-radius:7px;background:${x.bad ? '#FFF3E3' : '#1E232B'};color:${x.bad ? '#D97706' : '#FFFFFF'};display:inline-flex;align-items:center;justify-content:center;flex:none">${x.bad ? ic('alert', 'sm') : ic('check', 'sm')}</span>
            <span class="grow" style="font-size:14px;font-weight:600;color:#14171C">${x.label}</span>
            <span class="t14-num" style="font-size:13px;font-weight:600;color:${x.bad ? '#C46800' : '#1E232B'}">${x.val}</span>
          </div>`).join('')}
        </div>
        <div class="caption" style="margin:10px 4px 0;text-align:center">全部通过后，点击「下一步」设备将自动退出充电桩</div>
      </div>
      <div class="bottom-bar">${badItems.length ? ctaMain('preRecheck', ic('rotate', 'sm'), '重新检测') : ctaMain('preLaunchMap', ic('map', 'sm'), '下一步')}</div>
    </div>`;
  }

  function dualJoysHtml14(canDrive) {
    const offCls = canDrive ? '' : 'off';
    const leftArrows = `<span class="dir" style="left:55px;top:7px;transform:rotate(180deg)">${ic('down', 'sm')}</span><span class="dir" style="left:55px;top:103px">${ic('down', 'sm')}</span>`;
    const rightArrows = `<span class="dir" style="left:7px;top:55px;transform:rotate(90deg)">${ic('down', 'sm')}</span><span class="dir" style="left:103px;top:55px;transform:rotate(-90deg)">${ic('down', 'sm')}</span>`;
    return `<div class="ls14-joy-left">
      <div class="t14-joy axis-y ${offCls}" id="joyLeft">${leftArrows}<div class="knob"></div></div>
      <span class="ls14-joy-tag">前进 / 后退</span>
    </div>
    <div class="ls14-joy-right">
      <div class="t14-joy axis-x ${offCls}" id="joyRight">${rightArrows}<div class="knob"></div></div>
      <span class="ls14-joy-tag">左转 / 右转</span>
    </div>`;
  }

  function renderMapping14() {
    const mp = ui.mp, st = mpStep(mp), paused = ['pausePending', 'mappingPaused', 'resumePending'].includes(mp);
    const EXC = MAP_EXC[ui.mapExc], rcLocked = !!ui.rcTakeover;
    const isEdgePhase = ['edgeManual', 'edgeAuto', 'edgeTakeover'].includes(mp);
    const isCovPhase = ['coverageManual', 'coverageAuto'].includes(mp);
    const canDrive = !EXC && !rcLocked && (MANUAL_DRIVE.includes(mp) || mp === 'edgeAuto' || (mp === 'mappingPaused' && MANUAL_DRIVE.includes(ui.pausedFrom)));
    const sbtn = (act, label, cls = 'btn-secondary', dis = false) => `<button class="btn ${cls}" ${dis ? 'disabled' : `data-act="${act}"`}>${label}</button>`;

    let hint = '', trFloat = '', btmHtml = '';
    if (mp === 'driveToStart') {
      hint = '开到草坪边缘后，点下方「设置起点」';
      btmHtml = ctaMain('atStart', ic('locate', 'sm'), '设置起点');
    } else if (mp === 'edgeStarting') {
      hint = '正在准备沿边，请稍候…';
      btmHtml = sbtn('', '<span class="spin"></span>等待设备', 'btn-secondary', true);
    } else if (isEdgePhase) {
      hint = mp === 'edgeAuto' ? '正在自动巡边，拨动摇杆可随时接管'
        : ui.edgePts >= EDGE_N ? '已回到起点附近，可以「闭合轮廓」了'
        : '沿着草坪外围慢慢走一圈';
      btmHtml = ctaMain('finishEdge', ic('check', 'sm'), '闭合轮廓', '', ui.edgePts < EDGE_N);
    } else if (mp === 'regionSummary' || mp === 'nextChoose') {
      hint = '这块草坪已建好，可保存或继续完善';
      trFloat = `<div class="ls14-tr-float">
        ${ctaMain('saveMapDirect', ic('check', 'sm'), '保存地图')}
        <button class="btn" data-act="enterCoverage">覆盖地图</button>
      </div>`;
      btmHtml = ui.region < 3 ? sbtn('addNewLawn', '新建草坪') : '';
    } else if (isCovPhase) {
      hint = `已覆盖约 ${ui.covProg}% · 向下拉左摇杆可擦除轨迹`;
      btmHtml = ctaMain('finishCoverage', ic('check', 'sm'), '结束覆盖');
    } else if (mp === 'nogoPrep') {
      hint = '开到禁区边缘后，点下方「设置起点」';
      btmHtml = ctaMain('startNogoRec', ic('locate', 'sm'), '设置起点');
    } else if (mp === 'nogoRec') {
      hint = ui.nogoProg >= 1 ? '已回到起点附近，可以「闭合轮廓」了' : '绕着花坛或禁区边缘走一圈';
      btmHtml = ctaMain('nogoDone', ic('check', 'sm'), '闭合轮廓', '', ui.nogoProg < 1);
    } else if (mp === 'channelPrep') {
      hint = '开到草坪边缘或充电桩前，设置新建草坪起点';
      btmHtml = ctaMain('startChannel', ic('play', 'sm'), '开始创建');
    } else if (mp === 'channelStarting' || mp === 'channelWait') {
      hint = '正在同步新建区域状态，请稍候…';
      btmHtml = sbtn('', '<span class="spin"></span>请稍候', 'btn-secondary', true);
    } else if (mp === 'channelRec') {
      hint = ui.chProg >= 0.7 ? '已到达目标草坪，可点「结束创建」' : '慢慢开向另一块草坪或充电桩前';
      btmHtml = ctaMain('finishChannel', ic('check', 'sm'), '结束创建', '', ui.chProg < 0.7);
    } else if (mp === 'saving') {
      hint = '正在保存地图，请稍候…';
      btmHtml = sbtn('', '<span class="spin"></span>保存中', 'btn-secondary', true);
    } else if (mp === 'saveFailed') {
      hint = '保存未成功，已采集区域已为你保留';
      btmHtml = sbtn('cancelMapping', '取消建图', 'btn-secondary danger-text') + ctaMain('retrySave', ic('rotate', 'sm'), '重试保存');
    } else if (paused || mp === 'canceling') {
      hint = mp === 'mappingPaused' ? '建图已暂停，当前轨迹已保留' : '正在等待设备确认…';
      btmHtml = mp === 'canceling' ? sbtn('', '<span class="spin"></span>退出中', 'btn-secondary', true)
        : sbtn('cancelMapping', '取消建图', 'btn-secondary danger-text') + ctaMain('resumeMapping', ic('play', 'sm'), '恢复建图');
    }

    if (EXC) {
      btmHtml = EXC.out ? ctaMain(EXC.out[0], ic(EXC.icon, 'sm'), EXC.out[1], '', !!EXC.out[2]) : '';
    }

    const modeDrop = (isEdgePhase || isCovPhase) ? `<div class="ls14-mode-wrap">
      <button class="ls14-pill" data-act="mpToggleModeMenu">${isEdgePhase ? (mp === 'edgeAuto' ? '自动建图模式' : '手动建图模式') : (mp === 'coverageAuto' ? '自动覆盖' : '手动覆盖')} ${ic('down', 'sm')}</button>
      ${ui.mpModeMenu ? `<div class="ls14-mode-menu">
        ${isEdgePhase
          ? `<button class="${mp !== 'edgeAuto' ? 'on' : ''}" data-act="mpPickMode" data-m="edgeManual"><span>手动建图模式</span>${mp !== 'edgeAuto' ? ic('check', 'sm') : ''}</button>
             <button class="${mp === 'edgeAuto' ? 'on' : ''}" data-act="mpPickMode" data-m="edgeAuto"><span>自动建图模式</span>${mp === 'edgeAuto' ? ic('check', 'sm') : ''}</button>`
          : `<button class="${mp === 'coverageManual' ? 'on' : ''}" data-act="mpPickMode" data-m="coverageManual"><span>手动覆盖</span>${mp === 'coverageManual' ? ic('check', 'sm') : ''}</button>
             <button class="${mp === 'coverageAuto' ? 'on' : ''}" data-act="mpPickMode" data-m="coverageAuto"><span>自动覆盖</span>${mp === 'coverageAuto' ? ic('check', 'sm') : ''}</button>`}
      </div>` : ''}
    </div>` : `<span class="ls14-pill"><span class="status-dot ${paused ? 'warn' : 'ok'}"></span>${ui.regionNames[ui.region - 1]}</span>`;

    const excBanner = EXC ? `<div style="position:absolute;top:54px;left:50%;transform:translateX(-50%);z-index:7;width:430px">${alertBox14(EXC.tone, EXC.icon, EXC.t, EXC.d)}</div>`
      : rcLocked ? `<div style="position:absolute;top:54px;left:50%;transform:translateX(-50%);z-index:7;width:430px">${alertBox14('ok', 'pad', '实体遥控器控制中', '实体遥控器已接管，App 摇杆暂时失效')}</div>` : '';

    const dlg = ui.mdlg ? mapModalHtml14(ui.mdlg) : '';
    const canPause = RUNNING.includes(mp) && !EXC;

    return `<div class="ls14">
      <div class="map">${lawnSvg({ mode: 'session', mower: sessionRobot(), heading: 90, active: RUNNING.includes(mp), fit: 'meet', ...mappingView() })}</div>
      <div class="ls14-top">
        <button class="v3-sq-fab" data-act="cancelMapping" aria-label="退出">${ic('close', 'sm')}</button>
        ${modeDrop}
        <span class="ls14-hint-pill"><i class="dot"></i><span>${hint}</span></span>
        <div style="flex:1"></div>
        <span class="ls14-pill t14-num">${ic('wifi', 'sm')} ${battery(78)}78%</span>
      </div>
      ${excBanner}
      ${trFloat}
      ${dualJoysHtml14(canDrive)}
      <div class="ls14-btm-bar">${btmHtml}</div>
      ${dlg}
    </div>`;
  }

  function mapModalHtml14(kind) {
    const D = {
      chIntro: ['新建区域', '', '我知道了'],
      nogoIntro: ['禁区', '', '我知道了'],
      outOfMap: ['机器未在地图范围内', '当前机器未在地图区域内，请将机器遥控至地图内后重试。', '确定'],
      locFail: ['定位失败', '机器人雷达可能被遮蔽，请将机器人搬至地图内部空旷平坦处后重试。', '我知道了'],
      cancelMapping: ['退出建图？', '退出后本次未保存的建图轨迹将全部丢弃。', '放弃并退出'],
      resumeMapping: ['恢复建图？', '设备将从暂停前阶段继续执行。', '恢复'],
    }[kind];
    if (!D) return '';
    const singleOk = ['outOfMap', 'locFail'].includes(kind);
    const bodyHtml = kind === 'chIntro' ? `<div style="margin:10px 0 16px">${chIntroBody()}</div>`
      : kind === 'nogoIntro' ? `<div style="margin:10px 0 16px"><div class="t14-card" style="padding:12px;text-align:center;background:#FFF7F8;border-color:#F4C2C7;margin-bottom:10px">
          <svg viewBox="0 0 220 84" style="width:200px;height:76px;margin:0 auto"><rect width="220" height="84" rx="10" fill="#E3F2DD"/><rect x="74" y="20" width="72" height="44" rx="8" fill="rgba(194,39,54,0.18)" stroke="#C22736" stroke-width="2" stroke-dasharray="4 3"/><text x="110" y="46" font-size="11" fill="#C22736" font-weight="700" text-anchor="middle">禁区范围</text></svg>
        </div><div class="body">禁区是地图上标记为禁止进入的区域，Robot 不会在此区域内行驶或割草。</div></div>`
      : `<div class="body" style="margin:10px 0 18px;line-height:1.55">${D[1]}</div>`;
    return `<div class="mdlg-wrap"><div class="t14-surface mdlg" style="width:420px;padding:18px">
      <div class="title" style="font-size:16px">${D[0]}</div>
      ${bodyHtml}
      <div class="actions" style="margin:0">${singleOk ? '' : '<button class="btn btn-secondary" data-act="mdlgNo">取消</button>'}
        ${modalBtn(singleOk ? 'mdlgNo' : 'mdlgYes', D[2], kind === 'cancelMapping' ? 'danger' : '')}</div>
    </div></div>`;
  }

  function renderMapList14() {
    const activeIdx = ui.activeMapIdx || 0;
    const validMaps = ui.maps.map((m, i) => ({ m, i })).filter(({ i }) => !ui.deletedMaps.includes(i));
    const empty = ui.data === 'empty' || validMaps.length === 0;
    return `
    <div class="sub-page">${nav('地图管理' + stBadge('code'))}
      <div class="scroll with-bar">
        ${!empty && ui.mapDelErr ? `<div style="margin:6px 0 10px">${alertBox14('bad', 'alert', '云端删除同步失败', '仅本地移除占位，需点击补偿重试以彻底清理云端记录。', '<button class="t14-keypill" data-act="retryCloudDel">重试删除</button>')}</div>` : ''}
        ${empty ? `
        <div class="t14-card empty-block" style="margin-top:8px">${emptyScene('map')}
          <div class="title">暂无可用地图</div>
          <div class="body">请确保机器停放在基站或草坪区域内，点击下方「新增地图」开始沿边建图。</div>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
          ${validMaps.map(({ m, i }) => {
            const on = i === activeIdx;
            return `
          <div class="t14-card" style="padding:12px;${on ? 'border-color:#1E232B;background:#FFFFFF' : ''}">
            <div style="display:flex;align-items:center;gap:12px">
              <button data-act="loadMap114" data-i="${i}" aria-label="选择${m.name}" style="width:22px;height:22px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;border:${on ? '6px solid #1E232B' : '1.5px solid #B8C2CC'};background:#FFFFFF"></button>
              <button class="map-thumb" style="width:68px;height:56px;background:#F2F5F2;border-radius:10px;flex:none" data-act="openMap" data-i="${i}">${mapThumb(i)}</button>
              <button style="flex:1;min-width:0;text-align:left" data-act="openMap" data-i="${i}">
                <div class="title">${m.name}</div>
                <div class="caption t14-num" style="margin-top:4px">${m.zones} 块草坪 · ${i === 0 ? '206' : '64'} ㎡</div>
              </button>
              <button class="v3-sq-fab" style="width:32px;height:32px;border-radius:9px;flex:none" data-act="rowMenu" data-kind="map" data-i="${i}" aria-label="更多">⋯</button>
            </div>
          </div>`;
          }).join('')}
        </div>
        <div class="caption" style="margin:12px 4px">创建新地图需从基站出发，确保新区域内含充电桩信号覆盖。</div>`}
      </div>
      <div class="bottom-bar">${ctaMain('mapStart', ic('plus', 'sm'), '新增地图')}</div>
    </div>`;
  }

  function renderMapEdit14() {
    const m = ui.maps[ui.mapIdx] || ui.maps[0];
    const del = ui.mapEditDeleted || [];
    const hotspots = [
      ['区域 1', 'left:30%;top:22%'],
      ['区域 2', 'left:32%;top:64%'],
      ['通道 1', 'left:22%;top:45%'],
    ].filter(([n]) => !del.includes(n));
    const sel = ui.mapEditSel;
    const dlg = ui.mdlg ? mapModalHtml14(ui.mdlg) : '';
    return `
    <div class="ls14">
      <div class="map">${lawnSvg({ mower: [150, 220], view: '-260 60 1180 560', fit: 'meet', k: 1.0, shortSide: 390, noObst: true })}</div>
      <div class="ls14-map-hotspots">
        ${hotspots.map(([n, pos]) => {
          const isSel = sel === n;
          return `<div class="${isSel ? 'ls14-zone-sel' : ''}" style="${pos};position:absolute">
            <button class="ls14-hotspot ${isSel ? 'on' : ''}" style="position:relative" data-act="mapEditPick" data-n="${n}">${ui.alias[n] || n}</button>
            ${isSel ? `<button class="del-x" data-act="mapEditDel" data-n="${n}" aria-label="删除">×</button>` : ''}
          </div>`;
        }).join('')}
      </div>
      <div class="ls14-top">
        <button class="v3-sq-fab" data-act="back" aria-label="返回">${ic('right', 'sm').replace('<svg', '<svg style="transform:scaleX(-1)"')}</button>
        <span class="ls14-pill">${m.name || '地图编辑'}</span>
        <span class="ls14-hint-pill"><i class="dot"></i><span>${sel ? `已选中「${ui.alias[sel] || sel}」，可重命名或删除` : '轻点地图上的草坪或通道即可编辑'}</span></span>
        <div style="flex:1"></div>
        <span class="ls14-pill t14-num">${ic('wifi', 'sm')} ${battery(86)}86%</span>
      </div>
      <div class="ls14-tr-float">
        ${ctaMain('mapEditSave', ic('check', 'sm'), '保存地图')}
        ${sel ? `<div style="display:flex;gap:8px">
          <button class="v3-sq-fab" style="width:38px;height:38px" data-act="mapEditRename" data-n="${sel}" aria-label="重命名">${ic('edit', 'sm')}</button>
          <button class="v3-sq-fab" style="width:38px;height:38px;color:#C22736" data-act="mapEditDel" data-n="${sel}" aria-label="删除">${ic('close', 'sm')}</button>
        </div>` : ''}
      </div>
      ${dualJoysHtml14(true)}
      <div class="ls14-btm-bar">
        <button class="btn" data-act="nogoStart">设置禁区</button>
        <button class="btn" data-act="mapEditChannel">设置通道</button>
        <button class="btn" data-act="mapEditAddLawn">新增草坪</button>
      </div>
      ${dlg}
    </div>`;
  }

  /* 模块三：割草设置与控台二级页 */
  function renderSettings14() {
    const owner = ui.role === 'owner', off = ui.state === 'offline';
    const life = ui.bladeLife ?? 95;
    return `
    <div class="sub-page">${nav('设备设置')}
      <div class="scroll">
        <div class="x5-hero14">
          <div class="x5-hero14-main">
            <div class="x5-hero14-img"><img src="${IMG}add/device_product_large.png" alt="割草机器人"></div>
            <div style="flex:1;min-width:0">
              <div style="font-size:18px;font-weight:700;color:#14171C">${DEVICES[ui.deviceIdx]}${owner ? '' : ' <span class="t14-badge">共享</span>'}</div>
              <div class="caption t14-num" style="margin-top:4px">SN TMW2026A0018</div>
              <div class="caption" style="margin-top:4px;display:flex;align-items:center;gap:5px"><span class="online ${off ? 'off' : ''}"></span>${off ? '离线 · 最后在线 今天 10:32' : '在线 · 固件 V1.4.2'}</div>
            </div>
          </div>
          <div class="pulse-line14"></div>
        </div>

        <div class="t14-gtitle">割草与地图</div>
        <div class="group">
          ${cell('blade', '割草偏好', `刀盘 ${ui.bladeH} mm · 传感器`, 'mowPrefs')}
          ${cell('swap', '割草方向', `${ui.dir}°`, 'dirSheet', { sub: '弓字形往返，最后沿边一圈收尾' })}
          ${cell('map', '地图管理（114）', `${ui.maps.length} 张`, 'mapmgr')}
          ${cell('area', '全域扫描建图', '', '', { toggle: ui.fullScan, toggleAct: 'fullScan', sub: ui.fullScan ? '自动建图扫描整片草坪并识别内部障碍' : '关闭：自动建图仅沿外围跑一圈' })}
        </div>

        <div class="t14-gtitle">定位与通信配件</div>
        <div class="group">
          ${cell('lora', '通信模块 S3 LoRa' + stBadge('code'), ui.via === 'gw' ? '已配对 · 31F0' : '去配对', 'gateway', { sub: '搭配 S3 通信配件延伸庭院信号' })}
          ${cell('locate', 'RTK 定位', ui.rtk === 'local' ? '本地基站' : '网络 RTK', 'rtkSheet')}
          ${cell('wifi', '4G 备用网络', LTE_LABEL[ui.lteSt], 'lte4gPage')}
          ${cell('wifi', '更换 Wi-Fi', '', 'changeWifi')}
        </div>

        <div class="t14-gtitle">设备、保养与诊断</div>
        <div class="group">
          ${cell('lock', '设备 PIN 码', '已设置', 'pinSheet')}
          ${cell('msg', '语音播报', `${ui.voiceLang} · 音量${ui.vol}`, 'voiceSheet')}
          ${cell('dock', '更新充电桩位置', '', 'dockPos')}
          ${cell('blade', '刀片保养', `剩余 ${life}%`, 'bladeCarePage')}
          ${cell('locate', '机器位置', '顺德区 · 08:34', 'machinePosPage')}
          ${cell('pulse2', '设备自检' + stBadge('code'), '25 项检测', 'selfcheck')}
          ${cell('info', '设备信息' + stBadge('code'), 'MAC / 硬件 / 分模组版本', 'devInfo')}
        </div>

        <div class="t14-gtitle">共享与计划</div>
        <div class="group">
          ${owner ? cell('invite', '共享成员', '2 人', 'share') : cell('invite', '共享自', 'ann@xx.com', '')}
          ${cell('cal', '定时任务', ui.data === 'empty' ? '未设置' : '周三 09:30', 'schedules')}
          ${cell('records', '割草记录（5 态）', '本月 5 次', 'records')}
        </div>

        <div class="t14-gtitle">升级与电源</div>
        <div class="group">
          ${cell('upgrade', '固件升级' + stBadge('code'), ui.otaSt === 'success' ? '已是最新' : '<span class="reddot"></span>有新版本', 'ota', { sub: '查看固件版本与升级进度' })}
          ${owner ? cell('stop', '远程关机（117）' + stBadge('code'), '需机身重启', 'openPowerOff117', { warn: true }) : ''}
        </div>

        <div class="group" style="margin-top:20px">
          ${owner ? `<button class="tz-row" data-act="unbind" style="justify-content:center"><span class="danger-text title">解绑设备</span></button>
            <button class="tz-row" data-act="reset" style="justify-content:center"><span class="danger-text title">恢复出厂设置</span></button>`
          : `<button class="tz-row" data-act="leave" style="justify-content:center"><span class="danger-text title">退出共享</span></button>`}
        </div>
        <div class="caption" style="margin:8px 4px">${owner ? '解绑：设备从账号移除，网络配置保留。恢复出厂：清除网络与地图，需重新配网。' : '退出后设备从列表移除，需主人重新邀请。'}</div>
      </div>
    </div>`;
  }

  function prefsBody14() {
    const dead = ['offline', 'fault'].includes(ui.state);
    const lock = dead || ui.state === 'mowing';
    return `${dead ? `<div style="margin-bottom:10px">${alertBox14('warn', 'alert', ui.state === 'offline' ? '设备离线' : '设备故障', '当前不可调整割草偏好参数')}</div>` : ''}
      <div class="t14-card" style="padding:14px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="title">刀盘高度</span>
          <span class="t14-num" id="bladeVal" style="font-size:18px;font-weight:700;color:${lock ? '#8A94A2' : '#14171C'}">${ui.bladeH} <small style="font-size:12px;color:#5B6470">mm</small></span>
        </div>
        <div id="bladeRuler" data-lock="${lock ? 1 : ''}" style="margin-top:10px;height:34px;touch-action:pan-y;cursor:${lock ? 'default' : 'grab'};opacity:${lock ? .45 : 1}">${bladeTicks(ui.bladeH)}</div>
        ${ui.state === 'mowing' ? '<div class="caption warn" style="margin-top:6px">割草中不可调高，暂停或回桩后调整</div>' : ''}
      </div>
      <div class="t14-gtitle"><span>安全与环境</span><button class="link" style="color:#14171C;font-weight:600" data-act="prefsHelp">了解更多</button></div>
      <div class="group" style="${dead ? 'opacity:.45;pointer-events:none' : ''}">
        ${cell('rain', '雨水检测', '', '', { toggle: ui.rain, toggleAct: 'rain', sub: '检测到雨水暂停并回桩，当次定时取消' })}
        ${cell('shield', '碰撞检测', '', '', { toggle: ui.bump, toggleAct: 'bump', sub: '碰到障碍物自动急停' })}
        ${cell('pulse2', '超声波检测', '', '', { toggle: ui.sonic, toggleAct: 'sonic', sub: '提前避开低矮障碍物' })}
        ${cell('alert', '倾斜检测', '', '', { toggle: ui.tilt, toggleAct: 'tilt', sub: '倾斜角度过大自动急停' })}
        ${cell('upgrade', '抬起检测', '', '', { toggle: ui.lift, toggleAct: 'lift', sub: '被抬起时刀盘立即停转' })}
        ${cell('blade', '刀盘开关', '', '', { toggle: ui.rot, toggleAct: 'rot', sub: '关闭后移动不转动刀盘' })}
      </div>`;
  }

  function renderMowPrefs14() {
    return `<div class="sub-page">${nav('割草偏好')}<div class="scroll"><div style="height:6px"></div>${prefsBody14()}</div></div>`;
  }

  function renderBladeCare14() {
    const life = ui.bladeLife ?? 95;
    const worked = ((100 - life) * 1.0).toFixed(1), left = life.toFixed(1);
    return `
    <div class="sub-page">${nav('刀片保养')}
      <div class="scroll with-bar">
        <div class="t14-card" style="padding:18px 16px;text-align:center;margin-top:6px">
          <span class="spec-badge14"><i class="tri"></i><span>BLADE LIFE</span><span class="sep"></span><span class="t14-num">100H CYCLE</span></span>
          <div class="t14-num" style="margin-top:14px;font-size:38px;font-weight:700;color:${life <= 20 ? '#C22736' : '#16794B'};line-height:1">${life}%</div>
          <div class="caption t14-num" style="margin-top:6px">已工作 ${worked} h / 剩余 ${left} h</div>
          <div class="progress" style="margin-top:14px;height:8px"><i style="width:${life}%"></i></div>
        </div>
        <div class="t14-gtitle">更换建议</div>
        <div class="group pad">
          <div class="body">随着工作时间增长，切割刀片会逐渐磨损。为保证草坪切口平整，建议每工作 100 小时更换一次刀片。更换时请佩戴防护手套，避免划伤。</div>
        </div>
      </div>
      <div class="bottom-bar">${ctaMain('resetBladeLife', ic('check', 'sm'), '我已更换刀片')}</div>
    </div>`;
  }

  function renderMachinePos14() {
    return `
    <div class="sub-page">${nav('机器位置')}
      <div class="scroll">
        <div class="t14-card" style="padding:8px;margin-top:4px">
          <div class="mapcard" style="height:310px;border-radius:12px">
            ${lawnSvg({ mower: [212, 232], heading: 45, view: '20 120 360 320', fit: 'meet', k: 1.5, shortSide: 280 })}
            <span class="map-cap t14-num">22.8124° N · 113.2618° E</span>
          </div>
        </div>
        <div class="t14-card" style="padding:14px;margin-top:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div>
              <div class="title">机器最后上报位置</div>
              <div class="caption t14-num" style="margin-top:3px">更新时间：2026-11-23 08:34</div>
            </div>
            <button class="t14-keypill orange" data-act="refreshMachinePos"><span class="kw">${ic('locate', 'sm')}</span><span>刷新位置</span></button>
          </div>
          <div class="body" style="margin-top:8px">广东省佛山市顺德区新宝电器园区草坪测试区</div>
        </div>
      </div>
    </div>`;
  }

  function renderSchedules14() {
    const list = ui.data === 'empty' ? [] : SCHEDS;
    const active = list.filter(x => x.on && !x.mapDeleted);
    const en = Boolean(Number(ui.schedEn));
    const nextInfo = pickNextSched(list, en);
    const nextIdx = nextInfo ? SCHEDS.indexOf(nextInfo.item) : -1;
    const onceList = list.filter(x => Boolean(x.date));
    const weeklyList = list.filter(x => !x.date);
    const wLabels = en ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['一', '二', '三', '四', '五', '六', '日'];
    const renderCard = x => {
      const idx = SCHEDS.indexOf(x);
      const activeOn = x.on && !x.mapDeleted;
      const tagCls = x.mapDeleted ? 'bad' : (x.last?.[0] || '');
      const tagTxt = x.mapDeleted ? '地图已删除' : (x.last?.[1] || '');
      return `<div class="t14-card" style="padding:12px 14px;${activeOn ? '' : 'opacity:.76;'}${x.mapDeleted ? 'border-color:#F4C2C7;background:#FFF7F8' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
          <button style="flex:1;min-width:0;display:flex;align-items:center;gap:8px;flex-wrap:wrap;text-align:left" data-act="editSched" data-i="${idx}">
            <span class="t14-num" style="font-size:25px;font-weight:700;line-height:1;color:#14171C">${x.t}</span>
            ${tagTxt ? `<span class="t14-badge ${tagCls === 'ok' ? 'ok' : tagCls === 'warn' ? 'warn' : tagCls === 'bad' ? 'bad' : ''}">${tagTxt}</span>` : ''}
          </button>
          <span class="switch ${activeOn ? 'on' : ''}" data-act="toggleSched" data-i="${idx}" role="switch" aria-label="开关"></span>
        </div>
        <button style="width:100%;text-align:left;margin-top:8px" data-act="editSched" data-i="${idx}">
          ${x.date ? `<div style="display:flex;align-items:center;gap:6px;font-size:12.5px;color:#5B6470">${ic('cal', 'sm')}<span class="t14-num">${x.date}（周${DAYN[dateToWeekday(x.date)]}）· ${x.onceDone ? '已执行并关闭' : '仅一次'}</span></div>`
            : `<div class="stat-days" style="max-width:210px">${[1, 2, 3, 4, 5, 6, 7].map((d, k) => `<i class="${(x.days || []).includes(d) ? 'on' : ''}">${wLabels[k]}</i>`).join('')}</div>`}
        </button>
        <button style="width:100%;display:flex;align-items:center;justify-content:space-between;margin-top:9px;padding-top:8px;border-top:1px solid #E5E9F0;font-size:12px;color:#5B6470" data-act="editSched" data-i="${idx}">
          <span style="display:flex;align-items:center;gap:5px">${ic('map', 'sm')}${x.map} · ${x.zone}</span>
          <span style="color:${x.mapDeleted ? '#C22736' : '#8A94A2'};font-weight:${x.mapDeleted ? '700' : '500'}">${x.mapDeleted ? '重选地图 ›' : activeOn ? '编辑 ›' : '已暂停 ›'}</span>
        </button>
      </div>`;
    };
    return `
    <div class="sub-page">${nav('定时任务' + stBadge('tbd'), list.length ? `<button class="r" data-act="newSched" aria-label="新建定时">${ic('plus', 'lg')}</button>` : '')}
      <div class="scroll">
        ${list.length ? `
        <button class="sched-hero t14-card" style="margin-top:4px" ${nextIdx >= 0 ? `data-act="editSched" data-i="${nextIdx}"` : ''}>
          <div class="sched-hero-map">${schedHeroMap(nextInfo ? nextInfo.item : null)}</div>
          <div class="sched-hero-body">
            <div class="sched-hero-top">
              <span style="display:inline-flex;align-items:center;gap:5px"><span class="status-dot ${nextInfo ? 'ok' : 'off'}"></span><span>下次出发</span></span>
              <span class="t14-badge t14-num">${active.length} 条启用</span>
            </div>
            <div class="sched-hero-main t14-num">${nextInfo ? nextInfo.label : '暂无待执行计划'}</div>
            <div class="sched-hero-foot">${nextInfo ? `${ic('map', 'sm')}<span>${nextInfo.item.map} · ${nextInfo.item.zone}</span>` : '开启任一定时后自动出发'}</div>
          </div>
        </button>
        ${onceList.length ? `<div class="t14-gtitle"><span>单次预约</span><span class="t14-num">${onceList.length}</span></div><div class="sched-list">${onceList.map(renderCard).join('')}</div>` : ''}
        ${weeklyList.length ? `<div class="t14-gtitle"><span>循环定时</span><span class="t14-num">${weeklyList.length}</span></div><div class="sched-list">${weeklyList.map(renderCard).join('')}</div>` : ''}
        <div class="caption" style="margin:12px 4px">到点时若设备离线、作业、建图或升级中，将跳过本次执行。</div>`
        : `<div class="t14-card empty-block" style="margin-top:8px">${emptyScene('sched')}<div class="title">还没有定时计划</div>
            <div class="body">设定时间后，割草机将按计划从充电桩自动出发，割完回桩。</div>
            <div style="width:100%;margin-top:10px">${ctaMain('newSched', ic('plus', 'sm'), '新建定时')}</div></div>`}
      </div>
    </div>`;
  }

  function renderScheduleEdit14() {
    const isTodayOnce = ui.schedRepeat === 'once' && ui.schedDate === TODAY_STR;
    const col = (vals, on, kind, disFn = () => false) => `<div class="col">${vals.map(v => { const dis = disFn(v); return `<button type="button" ${dis ? 'disabled style="opacity:.35;cursor:not-allowed"' : `data-act="pickSchedTime" data-kind="${kind}" data-v="${v}"`}><span class="${v === on ? 'on' : ''}">${v}</span></button>`; }).join('')}</div>`;
    const schedMap = ui.schedMapMissing ? null : (ui.maps[ui.schedMapIdx] || ui.maps[0]);
    const schedZones = !schedMap ? ['区域 1'] : (schedMap.zones === 1 ? ['区域 1'] : ['区域 1', '区域 2', '侧院']);
    const onceW = dateToWeekday(ui.schedDate);
    const hours = isTodayOnce ? ['09', '10', '11', '12', '14'] : ['07', '08', '09', '10', '11'];
    const mins = ['00', '15', '20', '30', '45'];
    const scope = ui.schedScope || (ui.allZones ? 'all' : 'zones');
    return `
    <div class="sub-page">${nav((ui.editNew ? '新建定时' : '编辑定时') + stBadge('tbd'), `<button class="r" data-act="saveSched">保存</button>`)}
      <div class="scroll ${ui.editNew ? '' : 'with-bar'}">
        ${ui.schedMapMissing ? `<div style="margin-bottom:10px">${alertBox14('bad', 'alert', '原关联地图已删除', '保存或开启前必须重新选择地图。')}</div>` : ''}
        <div class="t14-gtitle">开始时间</div>
        <div class="t14-card"><div class="wheel t14-num"><div class="band"></div>${col(hours, ui.schedHour, 'h', v => isTodayOnce && v < '10')}<span class="colon">:</span>${col(mins, ui.schedMin, 'm', v => isTodayOnce && ui.schedHour === '10' && v <= '15')}</div></div>

        <div class="t14-gtitle">重复周期</div>
        <div class="t14-surface" style="overflow:hidden">
          <div style="padding:12px 14px 4px"><div class="seg"><button class="${ui.schedRepeat === 'weekly' ? 'on' : ''}" data-act="schedWeekly">按周重复</button><button class="${ui.schedRepeat === 'once' ? 'on' : ''}" data-act="schedOnce">单次预约</button></div></div>
          ${ui.schedRepeat === 'weekly'
            ? `<div class="days" style="padding:12px 14px">${[1, 2, 3, 4, 5, 6, 7].map(d => `<button class="${ui.days.includes(d) ? 'on' : ''}" data-day="${d}">${DAYN[d]}</button>`).join('')}</div>`
            : `<button class="cell" data-act="onceDateSheet"><span class="ci">${ic('cal', 'sm')}</span><span class="grow title">执行日期</span><span class="val t14-num">${ui.schedDate === TODAY_STR ? '今天 · ' : ''}${ui.schedDate}（周${DAYN[onceW]}）</span><span class="chev">${ic('right', 'sm')}</span></button>`}
        </div>

        <div class="t14-gtitle">作业地图</div>
        <div class="t14-surface" style="overflow:hidden">${schedMap ? cell('map', schedMap.name, `${schedMap.zones} 个区域${ui.schedMapIdx === 0 ? ' · 当前' : ''}`, 'schedMapSheet') : cell('map', '请选择新地图', '点击重选', 'schedMapSheet', { warn: true })}</div>

        <div class="t14-gtitle">割草范围</div>
        <div class="t14-surface" style="overflow:hidden">
          <div style="padding:12px 14px"><div class="seg">
            <button class="${scope === 'all' ? 'on' : ''}" data-act="schedScope" data-v="all">全部区域</button>
            <button class="${scope === 'zones' ? 'on' : ''}" data-act="schedScope" data-v="zones">指定区域</button>
            <button class="${scope === 'edge' ? 'on' : ''}" data-act="schedScope" data-v="edge">指定沿边</button>
          </div></div>
          ${scope === 'all' ? '<div class="caption" style="padding:0 14px 12px">按区域顺序割完全部草坪后自动回桩。</div>'
            : `<div class="zones">${schedZones.map((z, i) => { const on = ui.schedZones.includes(i); return `<button class="${on ? 'on' : ''}" data-act="toggleSchedZone" data-i="${i}">${on ? ic('check', 'sm') : ''}${z}</button>`; }).join('')}</div>`}
        </div>
        <div class="caption" style="margin:10px 4px">按当前时区（America/Los_Angeles）执行，同日同开始时间不可冲突。</div>
      </div>
      ${ui.editNew ? '' : `<div class="bottom-bar">${ctaMain('delSched', ic('close', 'sm'), '删除定时', 'danger')}</div>`}
    </div>`;
  }

  function renderRecords14() {
    const shown = ui.data === 'empty' ? [] : RECS;
    const okList = shown.filter(r => r.result === 'SUCCESS' && ['COMPLETED', 'FINISHED'].includes(r.status));
    const okArea = okList.reduce((s, r) => s + r.area, 0);
    const okSec = okList.reduce((s, r) => s + r.durSec, 0);
    const pillTone = cls => cls === 'ok' ? 'ok' : cls === 'warn' ? 'warn' : cls === 'bad' ? 'bad' : '';
    return `
    <div class="sub-page">${nav('割草记录' + stBadge('code'))}
      <div class="scroll">
        <div class="month"><button data-act="prevMonth" aria-label="上个月">${ic('right').replace('<svg', '<svg style="transform:scaleX(-1)"')}</button>
          <span class="title t14-num">2026 年 11 月</span><button disabled aria-label="下个月">${ic('right')}</button></div>
        ${shown.length ? `
        <div class="t14-card" style="padding:14px 8px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center">
            <div><div class="t14-num" style="font-size:20px;font-weight:700;color:#14171C">${okList.length} 次</div><div class="caption">成功次数</div></div>
            <div style="border-left:1px solid #DCE2E8"><div class="t14-num" style="font-size:20px;font-weight:700;color:#16794B">${okArea} ㎡</div><div class="caption">累计面积</div></div>
            <div style="border-left:1px solid #DCE2E8"><div class="t14-num" style="font-size:20px;font-weight:700;color:#14171C">${fmtHours(okSec)}</div><div class="caption">累计时长</div></div>
          </div>
          <div class="caption" style="text-align:center;margin-top:8px">仅统计已完成的割草作业</div>
        </div>
        <div class="t14-gtitle"><span>全部记录</span><span class="t14-num">${shown.length} 条</span></div>
        <div class="group">${shown.map(r => `<button class="rec" data-act="recordDetail" data-i="${RECS.indexOf(r)}">
          <span class="date"><div class="t14-num" style="font-size:19px;font-weight:700">${r.d}</div><div class="caption">${r.w}</div></span>
          <span class="grow"><div class="title t14-num" style="display:flex;align-items:center;gap:6px">${r.t} 开始${r.source === 'SCHEDULE' ? '<span class="t14-badge">定时</span>' : ''}</div><div class="caption t14-num" style="margin-top:2px">${r.map} · ${r.dur} · ${r.area} ㎡</div></span>
          <span class="t14-badge ${pillTone(r.res[0])}">${r.res[1]}</span><span class="chev idle">${ic('right', 'sm')}</span></button>`).join('')}</div>`
        : `<div class="t14-card empty-block">${emptyScene('rec')}<div class="title">本月暂无割草记录</div>
            <div class="body">完成自动或手动割草后，将记录时长、面积与轨迹回放。</div></div>`}
      </div>
    </div>`;
  }

  function renderRecordDetail14() {
    const r = RECS[ui.recIdx || 0], part = r.plan && r.area < r.plan;
    let mapBlock = '';
    if (r.noRoute) {
      mapBlock = `<div class="t14-card" style="height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:16px">
        <span class="spin"></span><div class="title">记录文件处理中或暂无轨迹</div><div class="caption">可下拉刷新或稍后重试</div></div>`;
    } else if (!r.mapAvailable) {
      mapBlock = `<div class="mapcard nobasemap" style="border:1px solid #DCE2E8"><span class="map-cap">${r.map} · 地图已删除（无底图）</span>
        <svg viewBox="30 92 360 240" preserveAspectRatio="xMidYMid meet">${mowStripes(prefix(zigzag(0), r.prog / 100), 0, 1.92)}</svg></div>`;
    } else {
      mapBlock = `<div class="mapcard" style="border:1px solid #DCE2E8"><span class="map-cap">${r.map}</span>${lawnSvg({ progress: r.prog, dim: r.dim, mower: null, view: '0 136 400 460', fit: 'meet', k: 1.92, shortSide: 240 })}</div>`;
    }
    return `
    <div class="sub-page">${nav(`11 月 ${r.d} 日 · ${r.w}` + stBadge('code'), `<button class="r danger" data-act="delRecord">删除</button>`)}
      <div class="scroll">
        ${mapBlock}
        ${r.err ? `<div style="margin-top:10px">${alertBox14('bad', 'alert', '任务异常中断', r.err)}</div>` : ''}
        <div class="t14-card" style="margin-top:10px;padding:14px 8px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center">
            <div><div class="title t14-num">${r.dur}</div><div class="caption">时长</div></div>
            <div style="border-left:1px solid #DCE2E8"><div class="title t14-num">${r.area} ㎡</div><div class="caption">${part ? `计划 ${r.plan} ㎡` : '面积'}</div></div>
            <div style="border-left:1px solid #DCE2E8"><div class="title">${r.res[1]}</div><div class="caption">${r.source === 'SCHEDULE' ? '定时触发' : '手动启动'}</div></div>
          </div>
          ${part ? `<div class="progress" style="margin:12px 10px 4px"><i style="width:${Math.round(r.area / r.plan * 100)}%"></i></div>` : ''}
        </div>
        <div class="t14-gtitle">分区域汇总</div>
        <div class="group zones-sum">
          ${(r.zones || []).map(z => `<div class="zones-row"><span class="grow"><div class="title">${z.name}</div><div class="caption t14-num">实割 ${z.area} / ${z.size} ㎡ · ${z.dur}</div></span><span class="t14-badge ${z.prog === 100 ? 'ok' : ''} t14-num">${z.prog}%</span></div>`).join('')}
        </div>
        <div class="t14-gtitle">过程时间线</div>
        <div class="group timeline">
          ${r.tl.map(([t, a, b, dot = '', go]) => `<div class="tl"><span class="tm t14-num" style="width:86px">${t}</span><span class="dot ${dot}"></span><span><div class="title">${a}</div><div class="caption" style="margin-top:2px">${b}</div>${go ? `<button class="link" data-act="${go}">查看故障处理${ic('right', 'sm')}</button>` : ''}</span></div>`).join('')}
        </div>
      </div>
    </div>`;
  }

  function renderFault14() {
    const on = ui.state === 'fault';
    return `
    <div class="sub-page">${nav('故障详情')}
      <div class="scroll with-bar">
        <div class="t14-card" style="padding:18px 16px;text-align:center;margin-top:4px;${on ? 'border-color:#F4C2C7' : 'border-color:#BCE3CE'}">
          <span style="width:52px;height:52px;border-radius:14px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;background:${on ? '#FFECEF' : '#E8F6EE'};color:${on ? '#C22736' : '#16794B'}">${ic(on ? 'alert' : 'check')}</span>
          <div style="font-size:19px;font-weight:700;color:#14171C">设备被抬起</div>
          <div class="caption t14-num" style="margin-top:3px">今天 14:20 · 割草中 · 区域 1</div>
          <div style="margin-top:10px"><span class="t14-badge ${on ? 'bad' : 'ok'}">${on ? '● 故障未解除' : '✓ 已解除，可继续割草'}</span></div>
        </div>
        <div class="t14-gtitle">发生位置</div>
        <div class="mapcard small" style="border:1px solid #DCE2E8">${lawnSvg({ progress: 45, mower: [318, 190], heading: 75, view: '40 130 380 260', fit: 'meet', k: 1.6, shortSide: 160 })}
          <span class="where t14-num">区域 1 · 距充电桩约 18 m</span></div>
        <div class="t14-gtitle">影响与排查步骤</div>
        <div class="t14-card" style="padding:13px 14px">
          <div class="body" style="margin-bottom:10px">割草已暂停并停转刀盘；故障解除前不可续割，但支持直接回桩。</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${['把割草机放回平整草坪，四轮着地。', '确认周围无儿童与宠物靠近。', '故障状态消除后点击下方「继续割草」。'].map((t, i) => `<div style="display:flex;gap:10px;align-items:flex-start;font-size:13px"><span class="t14-num" style="width:20px;height:20px;border-radius:6px;background:#1E232B;color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:none">${i + 1}</span><span>${t}</span></div>`).join('')}
          </div>
        </div>
        <div class="t14-gtitle">同时存在提醒</div>
        <div class="group">${cell('alert', '低电量提醒', '', '', { warn: true, sub: '电量偏低，建议处理后尽快回桩充电' })}</div>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-secondary" data-act="dockFromFault">${ic('dock', 'sm')}回桩</button>
        ${ctaMain('resumeFromFault', ic('play', 'sm'), '继续割草', '', on)}
      </div>
    </div>`;
  }

  function renderJoystick14() {
    const pt = ui.joyOrient === 'portrait';
    const dir = (r, x, y) => `<span class="dir" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)">${ic('down', 'sm')}</span>`;
    const pad = `<div class="t14-joy" id="joy">${dir(180, 76, 8)}${dir(0, 76, 144)}${dir(90, 8, 76)}${dir(-90, 144, 76)}<div class="knob" id="knob"></div></div>`;
    const lock = ui.locked ? `<div class="ls-lock"><div class="t14-surface" style="width:330px;padding:20px;text-align:center">
      <div class="ico" style="margin:0 auto 10px;width:44px;height:44px;border-radius:12px;background:#FFF5D6;color:#8A5A00;display:flex;align-items:center;justify-content:center">${ic('wifioff')}</div>
      <div class="title">连接已中断</div>
      <div class="body" style="margin:6px 0 16px">割草机已停止行走且刀盘停转，网络恢复后可继续手动控制。</div>
      <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="exitJoyYes">退出</button>${modalBtn('unlock', '重新连接')}</div>
    </div></div>` : '';
    const SAFE = ['刀盘默认关闭，只移动不割草；长按 1 秒开启', '松开摇杆立即停止行走', '人员与宠物远离设备，保持在视线内', '断连或急停触发时自动停止行走与刀盘'];
    const jdlg = !ui.joyDlg ? '' : `<div class="mdlg-wrap"><div class="t14-surface mdlg" style="padding:20px">
      <div class="title" style="font-size:16px">${ui.joyDlg === 'safe' ? '手动控制安全须知' : '退出手动控制？'}</div>
      ${ui.joyDlg === 'safe' ? `<div style="margin:12px 0 16px;display:flex;flex-direction:column;gap:8px">${SAFE.map((t, i) => `<div style="display:flex;gap:9px;font-size:13px"><span class="t14-num" style="width:20px;height:20px;border-radius:6px;background:#1E232B;color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:none">${i + 1}</span><span>${t}</span></div>`).join('')}</div>`
        : `<div class="body" style="margin:8px 0 16px">退出后设备立即停止行走${ui.blade ? '并停转刀盘' : ''}。</div>`}
      <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="${ui.joyDlg === 'safe' ? 'exitJoyYes' : 'joyDlgNo'}">${ui.joyDlg === 'safe' ? '暂不使用' : '取消'}</button>
        ${modalBtn(ui.joyDlg === 'safe' ? 'joySafeOk' : 'exitJoyYes', ui.joyDlg === 'safe' ? '我已了解' : '确认退出')}</div>
    </div></div>`;

    if (pt) {
      const R = 29, C = (2 * Math.PI * R).toFixed(1);
      const bladeBtn = `<button class="jbtn blade ${ui.blade ? 'on' : ''}" ${ui.blade ? 'data-act="blade"' : 'data-hold="blade"'} aria-label="${ui.blade ? '关闭刀盘' : '长按 1 秒开启刀盘'}">
        <span class="jcirc"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="${R}" class="track"/><circle cx="32" cy="32" r="${R}" class="ring" style="stroke-dasharray:${C};stroke-dashoffset:${ui.blade ? 0 : C};stroke:#F08300"/></svg>${ic('blade')}</span>
        <span class="jlabel">${ui.blade ? '刀盘运转中' : '长按开刀盘'}</span></button>`;
      return `<div class="jp14">
        <div class="jp14-map-area">
          ${statusbar()}
          <div class="map">${lawnSvg({ mower: [205, 200], heading: 75, view: '0 70 410 460', fit: 'meet', k: 1.1 })}</div>
          <div class="jp14-topbar">
            <button class="v3-sq-fab" data-act="exitJoy" aria-label="退出">${ic('close', 'sm')}</button>
            ${joyModeToggleHtml()}
            <button class="v3-sq-fab" data-act="joyRotate" aria-label="切换横屏">${ic('rotate', 'sm')}</button>
          </div>
        </div>
        <section class="jp14-panel">
          <div class="jhead">
            <div><div class="jspeed"><b class="t14-num" id="speedTxt" data-num="1">0.00</b><span>m/s</span></div>
              <div class="caption">${ui.joyMode === 'map' ? '地图绝对方向基准' : '车体前向基准'} · 松手即停${ui.blade ? '，刀盘保持' : ''}</div></div>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="v3-sq-fab" style="width:32px;height:32px;border-radius:9px" data-act="jHand" aria-label="左右手互换">${ic('swap', 'sm')}</button>
              <div class="seg" style="width:124px">${['低', '中', '高'].map(g => `<button class="${ui.gear === g ? 'on' : ''}" data-gear="${g}">${g}</button>`).join('')}</div>
            </div>
          </div>
          <div class="jrow" style="margin-top:12px">${ui.jHand === 'left' ? `<div class="jcol">${bladeBtn}</div>${pad}` : `${pad}<div class="jcol">${bladeBtn}</div>`}</div>
        </section>
        ${lock}${jdlg}
      </div>`;
    }

    const bladeSw = ui.blade
      ? `<button data-act="blade" aria-label="关闭刀盘" style="height:32px;padding:0 12px;border-radius:10px;background:#D92D20;color:#FFFFFF;font-size:12px;font-weight:600;border:0;display:inline-flex;align-items:center;gap:5px;flex:none">${ic('stop', 'sm')}关闭</button>`
      : `<button data-hold="blade" aria-label="长按 1 秒开启刀盘" style="height:32px;padding:0 12px;border-radius:10px;background:#1E232B;color:#FFFFFF;font-size:12px;font-weight:600;border:0;display:inline-flex;align-items:center;gap:5px;flex:none">${ic('blade', 'sm')}长按开启</button>`;
    const drawerHtml = ui.joyDrawer ? `<div class="mdlg-wrap"><div class="t14-surface mdlg" style="width:500px;padding:18px">
      <div class="title" style="font-size:16px">遥控参数设置</div>
      <div class="t14-gtitle">刀盘高度</div><div class="seg">${['30', '40', '50', '60', '70'].map(v => `<button class="${ui.bladeGear === v ? 'on' : ''}" data-mopt="bladeGear:${v}">${v}mm</button>`).join('')}</div>
      <div class="t14-gtitle">刀盘转速与补光灯</div>
      <div style="display:flex;gap:10px">
        <div class="seg" style="flex:1">${[['auto', '自动转速'], ['manual', '手动转速']].map(([v, t]) => `<button class="${ui.bladeSpin === v ? 'on' : ''}" data-mopt="bladeSpin:${v}">${t}</button>`).join('')}</div>
        <button class="t14-keypill" data-act="toggleFillLight">补光灯：${ui.fillLightAuto ? 'Auto' : '关'}</button>
      </div>
      ${ui.bladeSpin === 'manual' ? `<div style="margin-top:8px"><input type="range" data-spin min="2000" max="3600" step="100" value="${ui.spin}" style="width:100%"><span class="caption t14-num">${ui.spin} rpm</span></div>` : ''}
      <div class="t14-gtitle">转向模式</div><div class="seg">${[['pivot', '原地转向'], ['ackermann', '阿克曼'], ['crab', '斜行']].map(([v, t]) => `<button class="${ui.steer === v ? 'on' : ''}" data-mopt="steer:${v}">${t}</button>`).join('')}</div>
      <div class="actions" style="margin-top:16px">${modalBtn('joyDrawerClose', '完成设置')}</div>
    </div></div>` : '';

    return `<div class="ls14">
      <div class="map">${lawnSvg({ mower: [205, 200], heading: 75, view: '-30 120 460 480', fit: 'meet', k: 1.23 })}</div>
      <div class="ls14-top">
        <button class="v3-sq-fab" data-act="exitJoy" aria-label="退出">${ic('close', 'sm')}</button>
        <span class="ls14-pill"><span class="status-dot ok"></span><span id="speedTxt">${ui.cruise ? '巡航 · 只可转向' : ui.joyMode === 'map' ? '地图正北基准' : '车体前向基准'}</span></span>
        ${joyModeToggleHtml()}
        <div style="flex:1"></div>
        <span class="ls14-pill t14-num">${ic('wifi', 'sm')} ${battery(86)}86%</span>
        <button class="v3-sq-fab" data-act="joyDrawer" aria-label="遥控参数">${ic('gear', 'sm')}</button>
        <button class="v3-sq-fab" data-act="joyRotate" aria-label="切换竖屏">${ic('rotate', 'sm')}</button>
      </div>
      <div class="ls14-left-stack">
        <div class="ls14-left-card">
          <div style="display:flex;align-items:center;justify-content:space-between"><span class="title" style="display:flex;gap:6px;align-items:center">${ic('blade', 'sm')}刀盘控制</span>${bladeSw}</div>
          <div class="caption" style="margin-top:5px;color:${ui.blade ? '#C22736' : '#5B6470'}">${ui.blade ? '刀盘旋转中 · 注意远离' : '长按 1 秒开启刀盘'}</div>
        </div>
        <div class="ls14-left-card">
          <div class="caption" style="font-weight:700;margin-bottom:6px">行走速度档位</div>
          <div class="seg">${['低', '中', '高'].map(g => `<button class="${ui.gear === g ? 'on' : ''}" data-gear="${g}">${g}</button>`).join('')}</div>
        </div>
        <div class="ls14-left-card">
          <div class="caption" style="font-weight:700;margin-bottom:6px">快捷转向 / 巡航</div>
          <div class="seg"><button data-act="uturn" data-d="左">左掉头</button><button data-act="uturn" data-d="右">右掉头</button><button class="${ui.cruise ? 'on' : ''}" data-act="cruise">巡航</button></div>
        </div>
      </div>
      <div class="ls14-joy-wrap">${pad}</div>
      ${lock}${jdlg}${drawerHtml}
    </div>`;
  }

  function renderLte4g14() {
    const owner = ui.role === 'owner', off = ui.state === 'offline', busy = ui.state === 'upgrading';
    const block = !owner ? '仅设备主人可开启 4G 服务' : off ? '设备离线，上线后激活' : busy ? '设备升级中，完成后激活' : '';
    const st = ui.lteSt;
    const head = (t, sub, tone) => `<div class="t14-card" style="padding:16px;margin-top:6px">
      <div style="display:flex;align-items:center;gap:8px"><span class="status-dot ${tone}"></span><div class="title">${t}</div></div>
      <div class="caption" style="margin-top:6px;line-height:1.5">${sub}</div></div>`;
    const about = `<div class="t14-gtitle">关于 4G 备用网络</div><div class="group bul">
      <div>默认关闭；开启后 Wi-Fi 不可用时自动切换内置 4G 卡，Wi-Fi 恢复后自动切回。</div>
      <div>激活需设备经 4G 发出首包数据，激活后开始计算服务期且不可撤销。</div></div>`;

    let body = '', act = '';
    if (st === 'off') {
      body = head('未开启 4G 备用网络', 'Wi-Fi 断网时设备会离线，无法远程查看与控制。', 'off') + about;
      act = ctaMain('lteStart', ic('wifi', 'sm'), '开启 4G 服务', '', !!block) + (block ? `<div class="caption" style="text-align:center">${block}</div>` : '');
    } else if (st === 'agree') {
      body = `<div class="t14-gtitle">开通前协议确认</div><div class="group bul">
          <div>激活过程约 1–3 分钟，设备会短暂切网。</div>
          <div>激活后不可撤销，可在已激活状态下随时关闭自动切换。</div></div>
        <button class="t14-surface" style="width:100%;padding:12px 14px;margin-top:12px;display:flex;align-items:center;gap:10px;text-align:left" data-act="lteAgreeTog">
          <span style="width:18px;height:18px;border-radius:5px;border:1.5px solid #1E232B;background:${ui.lteAgree ? '#1E232B' : '#fff'};color:#fff;display:inline-flex;align-items:center;justify-content:center">${ui.lteAgree ? ic('check', 'sm') : ''}</span>
          <span style="font-size:13px">我已阅读并同意《4G 服务协议》</span></button>`;
      act = `<div style="display:flex;gap:10px;width:100%"><button class="btn btn-secondary" style="flex:none;width:92px" data-act="lteBack">取消</button>${ctaMain('lteGo', ic('check', 'sm'), '确认激活', '', !ui.lteAgree)}</div>`;
    } else if (st === 'activating') {
      body = head('正在激活 4G 服务…', '后端已受理，等待设备经 4G 发出首包确认（约 1–3 分钟）。', 'warn') + about;
      act = ctaMain('', '<span class="spin"></span>', '激活收敛中…', '', true);
    } else if (st === 'active') {
      body = head('4G 备用网络已激活', '服务期至 2027-10-29 · 当前通道：Wi-Fi 优先', 'ok')
        + `<div class="group" style="margin-top:12px">${cell('wifi', 'Wi-Fi 不可用时自动切 4G', '', '', { toggle: ui.lte, toggleAct: 'lteUse', sub: ui.lte ? 'Wi-Fi 恢复后自动切回' : '已关闭：Wi-Fi 断开即离线' })}</div>` + about;
    } else if (st === 'failed') {
      const f = LTE_FAIL[ui.lteFail] || LTE_FAIL.nosignal;
      body = head('4G 激活失败', `${f[0]} · ${f[1]}`, 'bad') + about;
      act = ctaMain('lteRetry', ic('rotate', 'sm'), '重试激活', '', !!block);
    } else {
      body = head('4G 服务已到期', '2026-10-29 已到期，Wi-Fi 不可用时设备会离线。', 'warn') + about;
    }
    return `<div class="sub-page">${nav('4G 备用网络' + stBadge('tbd'))}<div class="scroll ${act ? 'with-bar' : ''}">${body}</div>${act ? `<div class="bottom-bar" style="flex-direction:column;gap:6px">${act}</div>` : ''}</div>`;
  }

  /* 模块四：我的与协同流程 */
  function renderAccount14() {
    const row = (k, v, act, extra = '') => `<button class="tz-row" ${act ? `data-act="${act}"` : ''}><span class="grow">${k}</span>${extra}<span class="body t14-num">${v}</span>${act ? `<span class="chev idle">${ic('right', 'sm')}</span>` : ''}</button>`;
    return `
    <div class="sub-page">${nav('个人设置')}
      <div class="scroll">
        <div class="t14-card" style="padding:14px;display:flex;align-items:center;gap:14px;margin-top:4px">
          <button style="width:54px;height:54px;border-radius:16px;background:#1E232B;color:#fff;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none" data-act="avatar">O</button>
          <div style="flex:1;min-width:0">
            <div class="title" style="font-size:17px">${ui.nick}</div>
            <div class="caption" style="margin-top:2px">owner@xx.com · 点击头像或行修改资料</div>
          </div>
          <button class="t14-keypill" data-act="nick">改名</button>
        </div>

        <div class="t14-gtitle">账号资料</div>
        <div class="group">
          ${row('头像', '更换', 'avatar')}
          ${row('用户名', ui.nick, 'nick')}
          ${row('登录邮箱', 'owner@xx.com', '')}
        </div>

        <div class="t14-gtitle">地区与地址</div>
        <div class="group">
          ${row('国家 / 地区', ui.country, 'country')}
          ${row('所在地址', ui.addr ? '1200 Oak St, Palo Alto, CA' : '未填写', 'addr')}
        </div>
        <div class="caption" style="margin:6px 4px">用于售后上门与配件寄送，不会公开给共享成员。</div>

        <div class="t14-gtitle">语言与单位</div>
        <div class="group">
          ${row('App 语言', ui.lang, 'langSheet')}
          ${row('面积单位', ui.unit === 'metric' ? '公制（㎡）' : '英制（ft²）', 'unitSheet')}
        </div>

        <div class="t14-gtitle">安全与注销</div>
        <div class="group">
          ${row('修改密码', '验证码校验', 'changePwd')}
          <button class="tz-row" data-act="deleteAccount" style="justify-content:center"><span class="danger-text title">注销账号</span></button>
        </div>
      </div>
    </div>`;
  }

  function renderEditAddr14() {
    const f = (label, val, ph = '') => `<div class="t14-gtitle" style="margin-top:10px">${label}</div>
      <div class="auth14-box" style="background:#FFFFFF"><input type="text" value="${val}" placeholder="${ph}" aria-label="${label}"></div>`;
    return `
    <div class="sub-page">${nav('所在地址', `<button class="r" data-act="saveAddr">保存</button>`)}
      <div class="scroll">
        ${f('国家 / 地区', ui.country)}
        ${f('街道地址', '1200 Oak St')}
        ${f('公寓、单元（可选）', '', 'Apt, suite, unit')}
        <div style="display:flex;gap:10px"><div style="flex:1">${f('城市', 'Palo Alto')}</div><div style="width:104px">${f('州', 'CA')}</div></div>
        ${f('邮编', '94301')}
      </div>
    </div>`;
  }

  const TZ_FULL = [
    ['Pacific/Honolulu', '夏威夷 (Honolulu)', 'UTC−10:00'],
    ['America/Anchorage', '阿拉斯加 (Anchorage)', 'UTC−09:00'],
    ['America/Los_Angeles', '太平洋时间 · 洛杉矶', 'UTC−08:00 / −07:00'],
    ['America/Denver', '山地时间 · 丹佛', 'UTC−07:00 / −06:00'],
    ['America/Chicago', '中部时间 · 芝加哥', 'UTC−06:00 / −05:00'],
    ['America/New_York', '东部时间 · 纽约', 'UTC−05:00 / −04:00'],
    ['Europe/London', '伦敦 / GMT', 'UTC±00:00'],
    ['Europe/Berlin', '中欧 · 柏林 / 巴黎', 'UTC+01:00'],
    ['Asia/Shanghai', '北京 / 新加坡 / 香港', 'UTC+08:00'],
    ['Asia/Tokyo', '东京 / 大阪', 'UTC+09:00'],
    ['Australia/Sydney', '悉尼 / 墨尔本', 'UTC+10:00'],
  ];

  function renderTimezone14() {
    const q = (ui.tzQuery || '').trim().toLowerCase();
    const list = TZ_FULL.filter(z => !q || z[0].toLowerCase().includes(q) || z[1].toLowerCase().includes(q));
    return `
    <div class="sub-page">${nav('时区')}
      <div class="scroll">
        <div class="group" style="margin-top:4px">${cell('clock', '自动设置', '', '', { toggle: ui.autoTz, toggleAct: 'autoTz', sub: '跟随手机 IANA 时区，夏令时自动调整' })}</div>
        ${ui.autoTz ? `
        <div class="t14-card" style="padding:14px;margin-top:10px;display:flex;align-items:center;justify-content:space-between">
          <div><div class="title t14-num">America/Los_Angeles</div><div class="caption t14-num" style="margin-top:2px">洛杉矶 · UTC−07:00（夏令时）</div></div>
          <span class="t14-badge ok">当前生效</span>
        </div>` : `
        <div class="auth14-box" style="background:#fff;margin-top:10px">${ic('search', 'sm')}<input type="text" data-search="tzQuery" value="${ui.tzQuery || ''}" placeholder="搜索城市或 IANA 时区"></div>
        ${list.length ? `<div class="group" style="margin-top:10px">${list.map((z, i) => `<button class="tz-row" data-act="pickTz"><span class="grow">${z[1]}<div class="caption t14-num">${z[0]} · ${z[2]}</div></span>${i === 5 ? `<span class="ok">${ic('check')}</span>` : ''}</button>`).join('')}</div>`
          : `<div class="t14-card empty-block" style="margin-top:10px"><span class="bigico" style="background:#F3F5F8;color:#5B6470">${ic('search', 'lg')}</span><div class="title">未找到匹配时区</div><div class="body">请尝试搜索城市名称或 IANA 标识，如 Tokyo、Asia/Shanghai。</div><div style="margin-top:10px"><button class="t14-keypill" data-act="clearSearch">清空搜索</button></div></div>`}`}
        <div class="caption" style="margin:10px 4px">定时任务、割草记录和消息均按此 IANA 时区展示与执行。</div>
      </div>
    </div>`;
  }

  function renderCountry14() {
    const q = (ui.countryQuery || '').trim().toLowerCase();
    const list = COUNTRIES.filter(([en, zh]) => !q || en.toLowerCase().includes(q) || zh.includes(q));
    return `
    <div class="sub-page">${nav('国家 / 地区')}
      <div class="scroll">
        <div class="auth14-box" style="background:#fff;margin-top:4px">${ic('search', 'sm')}<input type="text" data-search="countryQuery" value="${ui.countryQuery || ''}" placeholder="搜索国家或地区"></div>
        ${list.length ? `<div class="group" style="margin-top:10px">${list.map(([en, zh]) => `<button class="tz-row" data-act="pickCountry" data-c="${en}"><span class="grow">${zh}<div class="caption">${en}</div></span>${en === ui.country ? `<span class="ok">${ic('check')}</span>` : ''}</button>`).join('')}</div>`
          : `<div class="t14-card empty-block" style="margin-top:10px"><span class="bigico" style="background:#F3F5F8;color:#5B6470">${ic('search', 'lg')}</span><div class="title">未找到匹配国家或地区</div><div class="body">请更换中文名称或英文关键词后再试。</div><div style="margin-top:10px"><button class="t14-keypill" data-act="clearSearch">清空搜索</button></div></div>`}
      </div>
    </div>`;
  }

  function renderDeleteAccount14() {
    const owned = ui.count > 0 && ui.role === 'owner';
    return `
    <div class="sub-page">${nav('注销账号')}
      <div class="scroll with-bar">
        ${owned ? `<div style="margin-top:4px">${alertBox14('warn', 'alert', `还有 ${ui.count} 台设备未解绑`, '注销前需要先解绑你作为主人的所有设备。')}</div>
          <div class="group" style="margin-top:10px">${cell('area', DEVICES[0], '去解绑', 'settings')}</div>` : ''}
        <div class="t14-gtitle">注销后果提示</div>
        <div class="group bul">
          <div>账号及个人资料将被永久删除，无法找回。</div>
          <div>你创建的家庭将自动解散，所有共享成员权限失效。</div>
          <div>设备割草记录、定时任务及消息将全部清除。</div>
          <div>你已加入的其他家庭将自动退出。</div>
        </div>
      </div>
      <div class="bottom-bar">${ctaMain('confirmDeleteAcc', ic('alert', 'sm'), '确认注销账号', 'danger', owned)}</div>
    </div>`;
  }

  function renderMessages14() {
    const empty = ui.data === 'empty';
    const body = empty
      ? `<div class="t14-card empty-block" style="margin-top:8px"><span class="bigico" style="background:#F3F5F8;color:#5B6470">${ic('msg', 'lg')}</span><div class="title">暂无设备消息</div>
          <div class="body">故障告警、割草完成、定时跳过与共享邀请将汇总于此。</div></div>`
      : grouped(MSGS, (m, i) => {
        const isUnread = !(m.read || ui.readAll);
        const icoBg = m.tone === 'bad' ? '#FFECEF' : m.tone === 'warn' ? '#FFF5D6' : m.tone === 'ok' ? '#E8F6EE' : '#F3F5F8';
        const icoFg = m.tone === 'bad' ? '#C22736' : m.tone === 'warn' ? '#8A5A00' : m.tone === 'ok' ? '#16794B' : '#5B6470';
        return `<button class="msg ${isUnread ? '' : 'read'}" data-msg="${i}">
          <span class="mi" style="border-radius:11px;background:${icoBg};color:${icoFg}">${ic(m.icon, 'sm')}</span>
          <span class="grow">
            <div class="top"><span class="title" style="font-weight:${isUnread ? '700' : '500'}">${isUnread ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#F08300;margin-right:6px;vertical-align:middle"></span>' : ''}${m.title}</span><span class="caption t14-num">${m.t}</span></div>
            <div class="desc">${m.desc}</div>
            ${m.dev ? `<div class="caption" style="margin-top:3px"><span class="t14-badge">${m.dev}</span></div>` : ''}
          </span></button>`;
      });
    return `<div class="sub-page">${nav('消息中心', !empty ? `<button class="r" data-act="readAll" ${unread() ? '' : 'disabled'}>全部已读</button>` : '')}<div class="scroll">${body}</div></div>`;
  }

  function renderShare14() {
    const hasMembers = ui.data !== 'empty' && ui.members;
    return `
    <div class="sub-page">${nav('共享成员')}
      <div class="scroll with-bar">
        <div class="t14-card" style="padding:12px 14px;margin-top:4px">
          <div class="caption" style="line-height:1.55">共享成员可查看设备状态、控制割草、管理定时；解绑设备、恢复出厂与成员管理仅主人可操作。</div>
        </div>
        <div class="t14-gtitle">家庭成员</div>
        <div class="group">
          <div class="member"><span class="avatar" style="background:#1E232B;color:#fff;border-radius:12px">O</span><span class="grow"><div class="title">你</div><div class="caption">owner@xx.com</div></span><span class="t14-badge ok">主人</span></div>
          ${hasMembers ? `<div class="member"><span class="avatar" style="border-radius:12px">A</span><span class="grow"><div class="title">ann@xx.com</div><div class="caption t14-num">10 月 2 日加入</div></span><button class="t14-keypill" style="color:#C22736" data-act="removeMember">移除</button></div>` : ''}
        </div>
        ${hasMembers ? `<div class="t14-gtitle">等待接受</div>
        <div class="group"><div class="member"><span class="avatar sys" style="border-radius:12px">${ic('msg', 'sm')}</span><span class="grow"><div class="title">bob@xx.com</div><div class="caption">邮箱邀请 · 7 天内有效</div></span><button class="t14-keypill" data-act="revoke">撤回</button></div></div>` : `
        <div class="t14-card empty-block" style="margin-top:12px"><span class="bigico" style="background:#F3F5F8;color:#5B6470">${ic('invite', 'lg')}</span>
          <div class="title">暂无共享成员与待处理邀请</div>
          <div class="body">邀请家人加入后，可共同查看设备状态、控制割草与管理定时计划。</div>
        </div>`}
      </div>
      <div class="bottom-bar">${ctaMain('openInvite', ic('invite', 'sm'), '邀请家庭成员')}</div>
    </div>`;
  }

  function renderAcceptInvite14() {
    const invSt = ui.inviteStatus || 'pending';
    return `
    <div class="sub-page">${nav('共享邀请')}
      <div class="scroll with-bar">
        <div class="t14-card" style="padding:16px;margin-top:4px">
          <div style="display:flex;align-items:center;gap:12px">
            <img src="${IMG}add/device_product_large.png" alt="设备" style="width:78px;height:auto;flex:none">
            <div style="min-width:0">
              <div style="font-size:18px;font-weight:700;color:#14171C">后院割草机</div>
              <div class="caption" style="margin-top:3px">ann@xx.com 邀请你加入「我的家」</div>
            </div>
          </div>
          <div class="pulse-line14" style="margin:12px 0"></div>
          <div style="font-size:12px;font-weight:700;color:#14171C;margin-bottom:6px">加入后权限范围</div>
          <div class="perm"><span class="ok">${ic('check', 'sm')}</span><span>查看状态与地图、启动/暂停割草、管理定时</span></div>
          <div class="perm"><span class="bad">${ic('close', 'sm')}</span><span>解绑设备、恢复出厂、邀请其他成员</span></div>
        </div>
        <div class="t14-gtitle">或输入 6 位分享码</div>
        <div class="t14-card" style="padding:10px 12px;display:flex;gap:8px;align-items:center">
          <div class="auth14-box" style="flex:1;background:#fff;height:40px"><input class="t14-num" type="text" placeholder="输入 6 位分享码" maxlength="6" aria-label="分享码"></div>
          <button class="t14-keypill orange" style="height:40px" data-act="joinCode"><span class="kw">${ic('check', 'sm')}</span><span>加入</span></button>
        </div>
      </div>
      <div class="bottom-bar">
        ${invSt === 'rejected' ? ctaMain('', ic('close', 'sm'), '已拒绝邀请', '', true)
          : invSt === 'accepted' ? ctaMain('', ic('check', 'sm'), '已接受并加入', '', true)
          : `<button class="btn btn-secondary" data-act="rejectInvite">拒绝</button>${ctaMain('acceptInv', ic('check', 'sm'), '接受邀请')}`}
      </div>
    </div>`;
  }

  /* 1.4-4 注入车体 / 地图双模式切换条（竖屏与横屏手动控制共用） */
  function joyModeToggleHtml() {
    const body = (ui.joyMode || 'body') === 'body';
    return `<div class="joymode-pill" title="切换摇杆方向基准">
      <button class="${body ? 'on' : ''}" data-act="setJoyMode" data-v="body">车体模式</button>
      <button class="${!body ? 'on' : ''}" data-act="setJoyMode" data-v="map">地图模式</button>
    </div>`;
  }

  function renderSheet14() {
    if (ui.sheet === 'switch' || (ui.page === 'home' && ui.homeView === 'list' && !ui.sheet)) {
      return renderSwitchDropdown14();
    }
    const wrap = (inner, safety = false) => `<div class="sheet-wrap" data-act="close"><div class="sheet${safety ? ' safety-sheet' : ''}"><div class="grab"></div>${inner}</div></div>`;
    if (ui.sheet === 'sigDetail') {
      return wrap(`<h3>信号与网络详情${stBadge('code')}</h3>
        <div class="group" style="border:1px solid #DCE2EA">
          <div class="tz-row"><span class="grow">当前接入通道</span><span class="t14-badge">Wi-Fi · Home-5G</span></div>
          <div class="tz-row"><span class="grow">信号强度</span><span class="t14-num" style="font-weight:700">88% (-54 dBm)</span></div>
          <div class="tz-row"><span class="grow">上行 / 下行速率</span><span class="t14-num caption">↑ 124 · ↓ 318 kB/s</span></div>
          <div class="tz-row"><span class="grow">S3 LoRa 配件</span><span class="t14-badge ok">已配对 · 31F0</span></div>
        </div>
        <div class="actions" style="margin-top:14px">${modalBtn('close', '关闭', '', false, 'data-self="1"')}</div>`);
    }
    if (ui.sheet === 'dockConfirm') {
      const modeInfo = ui.dockClear
        ? { badge: '任务结束 · 进度清零', cls: 'warn', desc: '返回充电桩并结束本次割草，下次将从头开始', dash: '#8C96A4', mark: 'clear' }
        : ui.dockAuto
          ? { badge: '断点记忆 · 满电自动续割', cls: 'ok', desc: '保留当前割草进度，电量充满后自动返回断点继续', dash: '#16794B', mark: 'auto' }
          : { badge: '保留断点 · 回桩待命', cls: '', desc: '暂停并保留当前进度，充电完成后等待手动继续', dash: '#4F7FE8', mark: 'pause' };
      return wrap(`<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px"><h3 style="margin:0">确认返回充电桩？</h3>${stBadge('code')}</div>
        <div class="dock14-hero">
          <div class="dock14-art" aria-hidden="true">
            <svg viewBox="0 0 116 64" fill="none">
              <rect x="4" y="6" width="108" height="52" rx="10" fill="#ECF4EA" stroke="#C5DAC0" stroke-width="1"/>
              <path d="M18 44 Q 44 44, 58 32 T 92 20" stroke="${modeInfo.dash}" stroke-width="2" stroke-dasharray="3.5 3" stroke-linecap="round"/>
              <rect x="85" y="13" width="16" height="14" rx="4" fill="#FFFFFF" stroke="#1E232B" stroke-width="1.4"/>
              <path d="M93 16.5l-2 3.5h2.2l-.8 3.5 2.6-3.8h-2.1z" fill="#16794B"/>
              ${modeInfo.mark === 'clear'
                ? `<circle cx="20" cy="44" r="7" fill="#FFF3E3" stroke="#F08300" stroke-width="1.3"/><path d="M17.5 41.5l5 5m0-5l-5 5" stroke="#C46800" stroke-width="1.4" stroke-linecap="round"/>`
                : `<circle cx="20" cy="44" r="7" fill="#E8F6EE" stroke="#16794B" stroke-width="1.3"/><circle cx="20" cy="44" r="2.6" fill="#16794B"/>`}
            </svg>
            <img src="${IMG}add/device_product_large.png" alt="X5" class="dock14-dev">
          </div>
          <div style="flex:1;min-width:0">
            <span class="t14-badge ${modeInfo.cls}">${modeInfo.badge}</span>
            <div style="font-size:12px;color:#5B6470;line-height:1.45;margin-top:6px">${modeInfo.desc}</div>
          </div>
        </div>
        <div class="group" style="border:1px solid #DCE2EA">
          <button class="cell" data-act="togDockClear">
            <span class="ci">${ic('stop', 'sm')}</span>
            <span class="grow">结束当前任务<div class="caption">清除进度，充电后不续割</div></span>
            <span class="switch ${ui.dockClear ? 'on' : ''}"></span>
          </button>
          <button class="cell" style="${ui.dockClear ? 'opacity:.45' : ''}" data-act="togDockAuto">
            <span class="ci">${ic('rotate', 'sm')}</span>
            <span class="grow">充电完成后自动恢复<div class="caption">与结束当前任务互斥</div></span>
            <span class="switch ${ui.dockAuto ? 'on' : ''}"></span>
          </button>
        </div>
        <div class="actions" style="margin-top:14px"><button class="btn btn-secondary" data-act="close" data-self="1">取消</button>${modalBtn('confirmDock107', '确认回桩')}</div>`);
    }
    if (ui.sheet === 'powerOffConfirm') {
      return wrap(`<h3>确认远程关机？${stBadge('code')}</h3>
        <div class="body" style="margin-bottom:16px">发送远程关机指令后，设备将彻底断电；下次开机必须在机身按电源键手动开启。</div>
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="close" data-self="1">取消</button>${modalBtn('doPowerOff117', '确认关机', 'danger')}</div>`);
    }
    if (ui.sheet === 'privacyDocSheet') {
      return wrap(`<h3>用户协议与隐私政策摘要</h3>
        <div class="body" style="margin-bottom:16px">登录凭据仅存于系统加密存储；Wi-Fi 密码脱敏处理且不落日志；地图与作业记录仅在授权家庭设备间同步。</div>
        ${modalBtn('close', '我已了解', '', false, 'data-self="1"')}`);
    }
    if (ui.sheet === 'manualSnSheet') {
      return wrap(`<h3>手动输入设备 SN</h3>
        <div class="caption" style="margin-bottom:10px">请在机身铭牌标签查看 12–16 位序列号（SN）。</div>
        <div class="auth14-box" style="margin-bottom:14px">${ic('qr', 'sm')}<input class="t14-num" id="manualSnIn" type="text" value="${ui.manualSnVal || 'TMW2026X50091'}" aria-label="设备 SN"></div>
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="close" data-self="1">取消</button>${modalBtn('submitManualSn', '校验并配网')}</div>`);
    }
    if (ui.sheet === 'gwInstallSheet') {
      return wrap(`<h3>S3 通信配件安装位置建议</h3>
        <div class="t14-card" style="padding:12px 14px;margin-bottom:14px;display:flex;flex-direction:column;gap:8px;font-size:13px">
          <div><b class="t14-num">1.</b> 选择开阔区域安装，四周半径至少 <b class="t14-num">2m (6.6ft)</b> 无遮挡。</div>
          <div><b class="t14-num">2.</b> 天线正上方天空尽量避开树木与屋檐遮挡。</div>
          <div><b class="t14-num">3.</b> 北半球建议确保南侧天空无遮挡；南半球确保北侧无遮挡。</div>
        </div>
        ${modalBtn('close', '我知道了', '', false, 'data-self="1"')}`);
    }
    if (ui.sheet === 'prefs') {
      return wrap(`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h3 style="margin:0">割草偏好</h3><button class="link" style="font-size:12.5px;color:#5B6470;display:flex;align-items:center" data-act="mowPrefs">更多设置${ic('right', 'sm')}</button></div>
        ${prefsBody14()}`);
    }
    if (ui.sheet === 'changePwd') {
      return wrap(`<h3>修改登录密码</h3>
        <div class="caption" style="margin-bottom:10px">通过邮箱验证码核验身份后重设密码。</div>
        <div class="auth14-box" style="margin-bottom:8px">${ic('pulse2', 'sm')}<input type="text" value="582914" aria-label="验证码"><button class="t14-keypill" style="height:28px" data-act="sendAuthCode">获取验证码</button></div>
        <div class="auth14-box" style="margin-bottom:14px">${ic('lock', 'sm')}<input type="password" value="Garden2026!" aria-label="新密码"></div>
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="close" data-self="1">取消</button>${modalBtn('savePwdChange', '确认修改')}</div>`);
    }
    if (ui.sheet === 'start') {
      const map = ui.mowMode === 'map', picked = ui.zones.filter(z => z.on); let n = 0;
      return wrap(`<h3>开始割草</h3>
        ${ui.resumable ? `<div class="t14-gtitle" style="margin-top:0">本次工作方式</div>
          <div class="seg" style="margin-bottom:10px"><button class="${ui.startFresh ? '' : 'on'}" data-act="resumeLast">继续上次</button><button class="${ui.startFresh ? 'on' : ''}" data-act="startFresh">重新开始</button></div>` : ''}
        ${ui.resumable && !ui.startFresh ? '' : `
          <div class="seg" style="margin-bottom:12px"><button class="${map ? 'on' : ''}" data-act="modeMap">地图割草</button><button class="${map ? '' : 'on'}" data-act="modeEdge">沿边除草</button></div>
          ${map ? `<div class="order-head"><span class="title">割草区域与顺序</span><span class="caption">拖动调整顺序</span></div>
            <div class="order">${ui.zones.map((z, i) => `<div class="ord ${z.on ? '' : 'off'}" draggable="true" data-zi="${i}">
              <span class="num t14-num">${z.on ? ++n : ''}</span><span class="grow title">${z.name}<div class="caption t14-num">${z.area} ㎡</div></span>
              <button class="chk ${z.on ? 'on' : ''}" data-act="toggleZone" data-i="${i}">${z.on ? ic('check', 'sm') : ''}</button>
              <span class="handle">${ic('grip', 'sm')}</span></div>`).join('')}</div>
            <div class="caption" style="margin:8px 2px 14px">${picked.length ? `顺序：${picked.map(z => z.name).join(' → ')}（115+103）` : '至少选择一个区域'}</div>`
          : `<div class="body" style="margin:0 2px 16px">沿当前草坪边界修剪一圈，不使用地图区域。</div>`}`}
        ${modalBtn('confirmStart', '开始割草', '', map && !picked.length && !(ui.resumable && !ui.startFresh))}`);
    }
    if (ui.sheet === 'dropmow') {
      return wrap(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="width:40px;height:40px;border-radius:12px;background:#FFF4E6;color:#D97706;border:1px solid rgba(240,131,0,.28);display:inline-flex;align-items:center;justify-content:center">${ic('dropmow')}</span>
          <div><h3 style="margin:0">安全提示 · Dropmow</h3><div class="caption">即放即割 · 无需预建图与选区</div></div>
        </div>
        <div class="body" style="margin-bottom:14px;line-height:1.55">请确保草坪边缘清晰，提前清理草坪区域内石头、管线、玩具等杂物，作业时远离儿童与宠物，请勿在陡坡、湿滑草坪使用。</div>
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="close" data-self="1">取消</button>${modalBtn('confirmDropmow', '我已了解，开始')}</div>`);
    }
    if (ui.sheet === 'dropmowSave') {
      return wrap(`<h3>任务已结束，是否保存本次地图？</h3>
        <div class="body" style="margin-bottom:16px">${ui.dropmowOrigin === 'nomap' ? '保存后该地图将直接显示在首页界面上，后续可随时开始割草。' : '保存后可在「地图管理」页查看这张 DropMow 临时地图，不影响主草坪。'}</div>
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="dropmowDiscard">取消</button>${modalBtn('dropmowSaveMap', '保存')}</div>`);
    }
    if (ui.sheet === 'mapStart') {
      const opt = (v, t, d, img) => `<button class="row ${ui.edgeMode === v ? 'on' : ''}" data-mopt="edgeMode:${v}"><img src="${IMG}device/${img}" alt="" style="width:40px;height:40px"><span class="grow"><div class="title">${t}</div><div class="caption">${d}</div></span>${ui.edgeMode === v ? `<span class="ok">${ic('check')}</span>` : ''}</button>`;
      return wrap(`<h3>开始建图 · 选择沿边方式</h3>
        ${opt('manual', '手动建图模式', '遥控绘制边界，适合复杂庭院', 'icon_device_mapping_manual.png')}
        ${(o => ui.pre === 'dark' ? o.replace('<button', '<button disabled style="opacity:.45"') : o)(ui.fullScan
          ? opt('auto', '全域扫描', '弓字形走满草坪，自动识别障碍', 'icon_device_mapping_auto.png')
          : opt('auto', '自动沿边', '沿草坪外围自动巡边，随时可接管', 'icon_device_mapping_auto.png'))}
        <div class="caption" style="margin:4px 2px 14px">建图全程横屏操作，最多支持 3 个草坪区域。</div>
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="backIntro">上一步</button>${modalBtn('askRegionName', '下一步', '', !ui.edgeMode)}</div>`);
    }
    if (ui.sheet === 'regionName') {
      return wrap(`<h3>区域名称</h3>${regionNameForm()}
        <div class="actions" style="margin:0"><button class="btn btn-secondary" data-act="backMapStart">上一步</button>${modalBtn('startMapping', '进入横屏建图')}</div>`);
    }
    return '';
  }

  global.TMOW14 = {
    stBadge,
    ctaMain,
    renderSplash14,
    renderLogin,
    renderRegister,
    renderResetPwd,
    renderHomeBento,
    renderEmptyHome14,
    renderAddDevice14,
    renderScanAdd14,
    renderProv14,
    renderLoraProvPage,
    renderGatewayS3,
    renderMapGuidePage,
    renderMapPrecheckPage,
    renderMapping14,
    renderMapList14,
    renderMapEdit14,
    renderSettings14,
    prefsBody14,
    renderMowPrefs14,
    renderBladeCare14,
    renderMachinePos14,
    renderSchedules14,
    renderScheduleEdit14,
    renderRecords14,
    renderRecordDetail14,
    renderFault14,
    renderJoystick14,
    renderLte4g14,
    renderSelfCheck126,
    renderOtaList14,
    renderOtaFw14,
    renderDevInfo14,
    renderProfile14,
    renderProfileSubPage,
    renderAccount14,
    renderEditAddr14,
    renderTimezone14,
    renderCountry14,
    renderDeleteAccount14,
    renderMessages14,
    renderShare14,
    renderAcceptInvite14,
    joyModeToggleHtml,
    renderSheet14,
  };
})(window);
