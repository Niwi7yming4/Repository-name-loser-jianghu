/**
 * 《敗犬江湖》Phase 1-2 實裝補丁包
 * 自動注入到主 HTML 中
 * 包含：懸賞系統、林雨晴共感、中間章節、態度回饋強化
 */

// ==========================================
// 第一部分：場景節點補丁
// ==========================================

const INTER_CHAPTER_NODES = {
    // ========== 中間章一：討債公司 ==========
    'chap1_5_debt_opener': {
        title: '中間插曲：討債公司',
        bg: 'bg-building-dark',
        text: [
            '「司徒摘星這條線，光是 Jessica 還不夠。」鐵叔在耳機裡說。',
            '「他有個部隊——專門處理『不聽話對象』的討債公司。妳要先把他們拔掉，才能進夜總會。」',
            '廢棄商辦大樓前，玻璃窗破裂。點鈔機的聲音從樓上傳下來，像數錢的心碎。'
        ],
        choices: [
            { label: '進去', action: s => { s.flags.chap1_5_debt_started = true; }, next: 'chap1_5_debt_l1_1' }
        ]
    },

    'chap1_5_debt_l1_1': {
        title: '第一層：催收陰影',
        bg: 'bg-building-dark',
        text: [
            '一樓大廳全是催繳單，貼滿了牆。妳看到一張母親簽過名的借據——日期是她離開武館的那一年。',
            '敵人：點鈔機傀儡 + 催收幽靈',
            '機制：點鈔機每回合偷 50 元；催收幽靈低聲重複欠款數字，試圖削弱妳的戰意。'
        ],
        combat: { enemies: ['debt_counting_machine', 'debt_collection_ghost'] },
        onWin: s => {
            syncRainQingSoul(s, '見證母親債務', 2);
            collectRainQingDiaryFragment('fragment_letter', s);
            s.flags.chap1_5_debt_l1_cleared = true;
        },
        nextWin: 'chap1_5_debt_l1_narration'
    },

    'chap1_5_debt_l1_narration': {
        title: '第一層敘事',
        bg: 'bg-building-dark',
        text: [
            '阿琳踩過碎紙，把母親的借據折好放進口袋。',
            '「她不是欠錢，」耳機裡鐵叔的聲音帶著顫抖，「是被逼著簽的。」',
            '阿琳沒有問，只是繼續往上走。'
        ],
        choices: [
            { label: '上樓', action: s => {}, next: 'chap1_5_debt_l2_1' }
        ]
    },

    'chap1_5_debt_l2_1': {
        title: '第二層：帳房血影',
        bg: 'bg-building-dark',
        text: [
            '二樓是檔案室。一個禿頭的中年人守在那，手指沾滿了印泥。',
            '陳帳房——司徒摘星的金牌帳簿員。',
            '他看著妳，冷笑說：「妳媽也欠過我。她最後一次來，把玉佩押在這裡就走了。」'
        ],
        combat: { enemies: [], boss: 'debt_accountant_chen', mechanic: '每回合召喚一張假帳單（血量 1），若未在一回合內摧毀則自爆傷害全隊 15。' },
        onWin: s => {
            s.flags.chap1_5_debt_l2_cleared = true;
            addInventoryItem('金錢幫帳本殘頁 (1/3)', s);
            showToast('✅ 獲得【金錢幫帳本殘頁】');
        },
        nextWin: 'chap1_5_debt_l2_coda'
    },

    'chap1_5_debt_l2_coda': {
        title: '勝戰戲語',
        bg: 'bg-building-dark',
        text: [
            '陳帳房臨終前，塞給妳一張紙：「Jessica 的直播時間表……別說是我給的。」',
            '他斷氣了。'
        ],
        choices: [
            { label: '收下時間表，往上走', action: s => { s.flags.jessica_schedule_gained = true; addInventoryItem('Jessica 直播時間表', s); }, next: 'chap1_5_debt_l3_narration' }
        ]
    },

    'chap1_5_debt_l3_narration': {
        title: '第三層：牆上的筆跡',
        bg: 'bg-building-dark',
        text: [
            '逃生梯的牆上用立可白寫著：「淑儀，對不起，我不該讓妳一個人去。」',
            '阿琳認出那是鐵叔的字。', 
            '她沒有問，只是把手指輕輕摸過那行字，繼續向上。'
        ],
        choices: [
            { label: '迎接下一個挑戰', action: s => { s.flags.chap1_5_debt_completed = true; s.flags.chap1_5_cleared = true; adjustBondValue('tieShu', 3, '母親謎團調查', true); }, next: 'hub' }
        ]
    },

    // ========== 中間章二：實驗室 ==========
    'chap2_5_lab_opener': {
        title: '中間插曲：司徒摘星的實驗室',
        bg: 'bg-lab-cyan',
        text: [
            'Jessica 戰敗後，冷笑著說：',
            '「司徒不只會用錢。他在頂樓底下養了一批……『作品』。」',
            '妳跟著她的目光往下看。地下層的綠光照亮了她的臉。'
        ],
        choices: [
            { label: '下去', action: s => { s.flags.chap2_5_lab_started = true; }, next: 'chap2_5_lab_discovery' }
        ]
    },

    'chap2_5_lab_discovery': {
        title: '核心發現',
        bg: 'bg-lab-cyan',
        text: [
            '培養槽的綠光映在妳臉上。',
            '其中一個槽裡，漂浮著一個與母親身形相似的女性軀體——五官模糊，但右手的繭，練拳留下的繭，一模一樣。',
            '「這不是她，」妳對自己說，「只是……樣本。」',
            '妳的拳頭開始發抖。'
        ],
        choices: [
            { label: '進去戰鬥', action: s => { s.flags.chap2_5_lab_seen_mother = true; }, next: 'chap2_5_lab_battle_prep' }
        ]
    },

    'chap2_5_lab_battle_prep': {
        title: '實驗室對峙',
        bg: 'bg-lab-cyan',
        text: [
            '一個穿著白袍的男人從陰影裡走出來。護目鏡後的眼睛冷得像北極。',
            '「妳就是那個女孩。」林博士說，「司徒先生說，只要能複製妳母親的武學天賦，就能量產超級士兵。」'
        ],
        combat: { boss: 'lab_dr_lin', mechanic: '每回合上護盾（30），護盾存在時召喚破產鬥士×2。摧毀護盾後該回合無法召喚。' },
        onWin: s => {
            s.flags.chap2_5_lab_cleared = true;
            addInventoryItem('司徒摘星實驗日誌', s);
            collectRainQingDiaryFragment('fragment_sunshower', s);
            showToast('📔 獲得【司徒實驗日誌】——揭露司徒真正動機');
        },
        nextWin: 'chap2_5_lab_diary_discovery'
    },

    'chap2_5_lab_diary_discovery': {
        title: '日誌殘頁',
        bg: 'bg-lab-cyan',
        text: [
            '妳從培養槽底部抽出一本實驗日誌。',
            '最後一頁寫著：',
            '「淑儀的 DNA 樣本已取得，但精神抵抗過強。建議改用其女作為替代載體。——司徒摘星批：同意。」',
            '妳把日誌塞進背包，沒有回頭。'
        ],
        choices: [
            { label: '離開實驗室', action: s => { adjustBondValue('xiaoYe', 2, '實驗揭露', true); showToast('🎭 小夜：「原來有錢人也會怕死……怕到願意當怪物。」'); }, next: 'hub' }
        ]
    },

    // ========== 中間章三：地下秩序真空期 ==========
    'chap3_5_vacuum_opener': {
        title: '中間插曲：地下秩序真空期',
        bg: 'bg-alley',
        text: [
            '司徒倒下後，地下社會亂成一鍋粥。',
            '三條線最亂——物流、情報、金流。',
            '鐵叔說：「妳要先穩住哪一條？」'
        ],
        choices: [
            { label: '【物流線】先搞定貨運', action: s => { s.flags.chap3_5_path = 'logistics'; }, next: 'chap3_5_logistics_1' },
            { label: '【情報線】掌握話語權', action: s => { s.flags.chap3_5_path = 'intel'; }, next: 'chap3_5_intel_1' },
            { label: '【金流線】控制錢的流向', action: s => { s.flags.chap3_5_path = 'finance'; }, next: 'chap3_5_finance_1' }
        ]
    },

    'chap3_5_logistics_1': {
        title: '物流線：前哨',
        bg: 'bg-logistics-hub',
        text: [
            '快遞站門口，兩個外送員正在互毆。',
            '一個喊：「這區是我的！」',
            '另一個喊：「司徒倒了，誰還管你！」',
            '阿琳嘆口氣：「你們再打，貨就都不用送了。」'
        ],
        combat: { enemies: ['logistics_courier_1', 'logistics_courier_2'] },
        onWin: s => { s.flags.chap3_5_logistics_cleared = true; adjustBondValue('longBo', 2, '物流穩定', true); },
        nextWin: 'chap3_5_final_choice'
    },

    'chap3_5_intel_1': {
        title: '情報線：網咖',
        bg: 'bg-internet_cafe',
        text: [
            '網咖角落，一個戴眼鏡的年輕人正看著妳的新聞。',
            '他轉頭：「妳就是那個打敗司徒的人？幫我一個忙，我給妳整份檔案。」',
            '「條件？」',
            '「把這個 USB 插進他們舊總部的伺服器。我想證明我媽不是自願幫他們洗錢的。」'
        ],
        combat: { enemies: ['intel_hacker_foe'] },
        onWin: s => { s.flags.chap3_5_intel_cleared = true; addInventoryItem('金錢幫洗錢檔案', s); },
        nextWin: 'chap3_5_final_choice'
    },

    'chap3_5_finance_1': {
        title: '金流線：錢莊',
        bg: 'bg-pawn_shop',
        text: [
            '錢莊老闆王姐把一疊現鈔推到妳面前。',
            '「三條線妳都穩住了，以後這區的錢，先經過妳的手。」',
            '妳沒有收，只說：「把抽成降一半，剩下的給那些被欠薪的人。」',
            '王姐愣了一下，然後笑了：「妳跟妳媽一樣，不會做生意。」'
        ],
        combat: { enemies: [] },
        choices: [
            { label: '收編王姐', action: s => { s.flags.chap3_5_finance_cleared = true; s.flags.chap3_5_finance_recruit = true; }, next: 'chap3_5_final_choice' },
            { label: '驅逐王姐', action: s => { s.flags.chap3_5_finance_cleared = true; s.flags.chap3_5_finance_expel = true; }, next: 'chap3_5_final_choice' }
        ]
    },

    'chap3_5_final_choice': {
        title: '最終清算',
        bg: 'bg-alley',
        text: [
            '三條線妳都穩住了。',
            '地下社會開始重新排序。',
            '第四章的戰爭會因為妳今天的選擇而改變形勢……'
        ],
        onEnter: s => {
            const cleared = [s.flags.chap3_5_logistics_cleared, s.flags.chap3_5_intel_cleared, s.flags.chap3_5_finance_cleared].filter(Boolean).length;
            showToast(`✅ 穩定了 ${cleared} 條線`);
        },
        choices: [
            { label: '進入第四章', action: s => { s.flags.chap3_5_completed = true; }, next: 'hub' }
        ]
    }
};

// ========== 懸賞系統 UI 補強 ==========
window.enhancedBountyBoardUI = function() {
    initializeBountyBoardTasks(state);
    const taskCards = (state.bountyBoard?.tasks || []).map(t => {
        const completed = !!state.bountyBoard?.completed[t.id];
        return `
            <div class="border ${completed ? 'border-green-600/40 bg-green-950/20' : 'border-amber-700/40 bg-amber-950/20'} rounded-lg p-3 mb-2">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-bold text-amber-300">${completed ? '✅' : '📌'} ${t.title}</div>
                        <div class="text-xs text-gray-300 mt-1">${t.desc}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-amber-200">💰 ${t.rewards?.money || 0}</div>
                        <div class="text-xs text-gray-400">${completed ? '已完成' : '未開始'}</div>
                    </div>
                </div>
                ${!completed ? `<button onclick="goToNode('bounty_${t.id}')" class="premium-btn mt-2 text-xs !py-1 w-full">接受任務</button>` : ''}
            </div>
        `;
    }).join('');
    
    showModal(`
        <h2 class="text-2xl font-bold text-amber-400 mb-1">📋 懸賞板</h2>
        <p class="text-xs text-gray-400 mb-3">第 ${state.bountyBoard?.week} 週 · 每週日 24:00 更新</p>
        <div class="max-h-[60vh] overflow-y-auto mb-4 pr-1">
            ${taskCards || '<div class="text-gray-500 text-sm">本週無任務，請稍候。</div>'}
        </div>
        <button onclick="closeModal()" class="premium-btn w-full">關閉</button>
    `);
};

// ========== 林雨晴共感值 UI 補強 ==========
window.displayRainQingSoulStage = function() {
    ensureRainQingState(state);
    const soul = Number(state.rainQing?.soul?.resonance || 0);
    const stage = getRainQingSoulStageLabel(soul);
    const emoji = soul >= 90 ? '☀️' : soul >= 65 ? '🌦️' : soul >= 40 ? '⛅' : soul >= 20 ? '☁️' : '🌧️';
    
    showToast(`${emoji} 共感值：${souls} / 100 · 階段【${stage}】`);
};

// ==========================================
// 自動注入點
// ==========================================

// 初始化函數（遊戲啟動時調用）
window.initializePhase1_2Systems = function() {
    console.log('[實裝補丁] Phase 1-2 系統初始化');
    
    // 1. 注冊中間章節節點
    if (typeof registerStoryNodes === 'function') {
        registerStoryNodes(INTER_CHAPTER_NODES);
        console.log('[中間章節] 已注冊');
    }
    
    // 2. 懸賞系統初始化
    initializeBountyBoardTasks(state);
    console.log('[懸賞系統] 已初始化');
    
    // 3. 林雨晴共感系統檢查
    ensureRainQingState(state);
    console.log('[林雨晴共感] 已初始化');
};

// 每日行動調用
window.dailyPhase1_2Updates = function(s = state) {
    try {
        // 懸賞板每日刷新
        initializeBountyBoardTasks(s);
    } catch (e) {
        console.warn('[Phase 1-2 補丁] 每日更新錯誤:', e);
    }
};

console.log('[載入] 《敗犬江湖》Phase 1-2 實裝補丁包 v1.0');
