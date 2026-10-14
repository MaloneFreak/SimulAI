function normalizeText(text) {
    console.log(getDynamicText('log_normalize'));
    let clean = text;
    clean = clean.replace(/R\$/g, 'R\\$');
    clean = clean.replace(/\n\s*_{3,}\s*\n/g, '\n___BLOCK___\n');
    clean = clean.replace(/\n\s*-{3,}\s*\n/g, '\n___BLOCK___\n');

    const questionPattern = getLanguageContent("regexPatterns");
    const boldQuestionPattern = getLanguageContent("regexPatterns2");

    clean = clean.replace(questionPattern, match => '\n___BLOCK___\n' + match);
    clean = clean.replace(boldQuestionPattern, '$1');

    return clean;
}

function parseBlock(rawBlock, index) {
    console.log(getDynamicText('log_parse_block').replace("{index}", index));
    let block = rawBlock.trim();
    if (block.length < 10) return null;

    let splitRegex = getLanguageContent("splitPatterns");
    let splitMatch = block.match(splitRegex);

    let problemPart = block;
    let solutionPart = "";

    if (splitMatch) {
        problemPart = block.substring(0, splitMatch.index).trim();
        solutionPart = block.substring(splitMatch.index).trim();
    }

    console.log(getDynamicText('log_parse_question'));
    let questionText = "";
    let options = [];
    const optionRegex = getLanguageContent("optionRegex");
    let match;
    let optionsStartIndex = problemPart.length;

    while ((match = optionRegex.exec(problemPart)) !== null) {
        if (match.index < optionsStartIndex) optionsStartIndex = match.index;
        options.push({id: match[1].toLowerCase(), text: match[2].trim()});
    }

    questionText = problemPart.substring(0, optionsStartIndex).trim();
    questionText = questionText.replace(getLanguageContent("questionRegex"), '');
    questionText = questionText.replace(/^\**\s*/, '');

    console.log(getDynamicText('log_parse_solution'));
    let correctAnswer = "";
    let justification = "";
    const answerMatch = solutionPart.match(getLanguageContent("answerRegex"));
    if (answerMatch) correctAnswer = answerMatch[1].toLowerCase();
    const justMatch = solutionPart.match(getLanguageContent("justificationRegex"));
    if (justMatch) justification = justMatch[1].trim().replace(/\*\*/g, '');

    if (options.length < 2) return null;

    return {id: index, question: questionText, options, correctAnswer, justification};
}

function parseBlock(rawBlock, index) {
    let block = rawBlock.trim();
    if (block.length < 10) return null;


    const splitRegex = getLanguageContent("splitPatterns");
    const splitMatch = block.match(splitRegex);

    let problemPart = block;
    let solutionPart = "";

    if (splitMatch) {
        problemPart = block.substring(0, splitMatch.index).trim();
        solutionPart = block.substring(splitMatch.index).trim();
    }

    let questionText = "";
    let options = [];

    const optionRegex = getLanguageContent("optionRegex");
    let match;
    let optionsStartIndex = problemPart.length;

    while ((match = optionRegex.exec(problemPart)) !== null) {
        if (match.index < optionsStartIndex) optionsStartIndex = match.index;
        options.push({
            id: match[1].toLowerCase(),
            text: match[2].trim()
        });
    }

    questionText = problemPart.substring(0, optionsStartIndex).trim();
    questionText = questionText.replace(getLanguageContent("questionRegex"), '');
    questionText = questionText.replace(/^\**\s*/, '');

    let correctAnswer = "";
    let justification = "";

    const answerMatch = solutionPart.match(getLanguageContent("answerRegex"));
    if (answerMatch) correctAnswer = answerMatch[1].toLowerCase();

    const justMatch = solutionPart.match(getLanguageContent("justificationRegex"));
    if (justMatch) {
        justification = justMatch[1].trim();
        justification = justification.replace(/\*\*/g, '');
    }

    if (options.length < 2) return null;

    return {
        id: index,
        question: questionText,
        options: options,
        correctAnswer: correctAnswer,
        justification: justification
    };
}

// --- History SYSTEM ---

const SettingsManager = {
    STORAGE_KEY: 'simulai_settings',

    load: function() {
        try {
            const settings = localStorage.getItem(this.STORAGE_KEY);
            return settings ? JSON.parse(settings) : { language: 'en-EN' };
        } catch (error) {
            return { language: 'en-EN' };
        }
    },

    save: function(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('ERROR', error);
        }
    },

    getLanguage: function() {
        const settings = this.load();
        return settings.language || 'en-EN';
    },

    setLanguage: function(lang) {
        const settings = this.load();
        settings.language = lang;
        this.save(settings);
    }
};

const HistoryManager = {
    STORAGE_KEY: 'simulai_history',

    load: function () {
        try {
            const history = localStorage.getItem(this.STORAGE_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Erron: ', error);
            return [];
        }
    },

    save: function (quizData, score, userAnswers, rawInput) {
        console.log(getDynamicText('log_save_history'));
        const history = this.load();

        const simulado = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(SettingsManager.getLanguage()),
            time: new Date().toLocaleTimeString(SettingsManager.getLanguage(), {hour: '2-digit', minute: '2-digit'}),
            score: score,
            totalQuestions: quizData.length,
            percentage: Math.round((score / quizData.length) * 100),
            questions: quizData,
            userAnswers: userAnswers,
            rawInput: rawInput,
            theme: this.extractTheme(rawInput)
        };

        history.unshift(simulado);

        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        this.updateHistoryCount();
        return simulado;
    },

    delete: function (id) {
        console.log(getDynamicText('log_delete_history').replace("{id}", id));
        const history = this.load();
        const newHistory = history.filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
        this.updateHistoryCount();
    },

    clear: function () {
        console.log(getDynamicText('log_clear_history'));
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateHistoryCount();
    },

    export: function () {
        const history = this.load();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${getLanguageContent("download_prefix")}${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    },

    extractTheme: function (rawInput) {
        const lines = rawInput.split('\n').slice(0, 5);
        for (let line of lines) {
            if (line.toLowerCase().includes(getDynamicText('quiz_question_identifier').toLowerCase())) {
                const match = line.match(/\[[^\]]+\]/);
                if (match) return match[0].replace(/[\[\]]/g, '');
            }
        }
        return getDynamicText('history_theme_unknown');
    },

    updateHistoryCount: function () {
        const history = this.load();
        document.getElementById('history-count').textContent = history.length;
    },

    render: function () {
        const history = this.load();
        const container = document.getElementById('history-container');
        const noHistory = document.getElementById('no-history');

        if (history.length === 0) {
            container.innerHTML = '';
            noHistory.style.display = 'block';
            return;
        }

        noHistory.style.display = 'none';

        container.innerHTML = history.map(item => `
    <div class="history-item bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md" data-id="${item.id}">
        <div class="flex justify-between items-start mb-3">
            <div>
                <h3 class="font-bold text-slate-800">${item.theme}</h3>
                <p class="text-sm text-slate-500">${item.date} ${getDynamicText('history_at')} ${item.time}</p>
            </div>
            <div class="flex items-center space-x-2">
                <div class="text-right">
                    <div class="text-2xl font-bold ${item.percentage >= 70 ? 'text-green-600' : item.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}">${item.percentage}%</div>
                    <div class="text-xs text-slate-500">${item.score}/${item.totalQuestions}</div>
                </div>
                <button onclick="deleteHistoryItem('${item.id}', this)" class="text-red-500 hover:text-red-700 ml-2" title="${getDynamicText('history_details')}">
                    🗑️
                </button>
            </div>
        </div>
        <div class="flex space-x-2">
            <button onclick="loadHistoryQuiz('${item.id}')" class="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition">
                ${getDynamicText('history_repeat')}
            </button>
            <button onclick="viewHistoryDetails('${item.id}')" class="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded text-sm hover:bg-slate-200 transition">
                ${getDynamicText('history_details')}
            </button>
        </div>
    </div>
            `).join('');
    }
};

function loadHistoryQuiz(id) {
    const history = HistoryManager.load();
    const item = history.find(h => h.id === id);

    if (item) {
        switchTab('create');
        quizData = item.questions;
        userAnswers = {};
        renderQuiz();
    }
}

function viewHistoryDetails(id) {
    const history = HistoryManager.load();
    const item = history.find(h => h.id === id);

    if (item) {
        const details = `
📊 ${getDynamicText('history_score_label')}

🎯 ${getDynamicText('history_theme')}: ${item.theme}
📅 ${getDynamicText('history_date')}: ${item.date} ${getDynamicText('history_at')} ${item.time}
📈 ${getDynamicText('history_result')}: ${item.score}/${item.totalQuestions} (${item.percentage}%)

❓ ${getDynamicText('history_questions_answers')}:

${item.questions.map((q, idx) => `
${idx + 1}. ${q.question}

${getDynamicText('history_user_answer')}: ${item.userAnswers[q.id] ? item.userAnswers[q.id].toUpperCase() : getDynamicText('history_not_answered')}
${getDynamicText('history_correct_answer')}: ${q.correctAnswer.toUpperCase()}
${item.userAnswers[q.id] === q.correctAnswer ? getDynamicText('history_correct') : getDynamicText('history_wrong')}

${q.justification ? `${getDynamicText('history_explanation')}: ${q.justification}` : ''}
`).join('\n' + '-'.repeat(50) + '\n')}
`;
        alert(details);
    }
}


const ui = {
    input: document.getElementById('ai-input'),
    views: {
        input: document.getElementById('input-view'),
        history: document.getElementById('history-view'),
        quiz: document.getElementById('quiz-view'),
        results: document.getElementById('results-area'),
        actions: document.getElementById('action-area')
    },
    container: document.getElementById('questions-container'),
    score: document.getElementById('score-display')
};

let quizData = [];
let userAnswers = {};

function switchTab(tab) {
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('tab-active');
    });
    document.getElementById(`tab-${tab}`).classList.add('tab-active');

    if (tab !== 'quiz') {
        quizData = [];
        userAnswers = {};
        ui.views.quiz.classList.add('hidden');
        ui.views.results.classList.add('hidden');
        ui.views.actions.classList.add('hidden');
    }

    if (tab === 'create') {
        ui.views.input.classList.remove('hidden');
        ui.views.history.classList.add('hidden');
    } else if (tab === 'history') {
        ui.views.input.classList.add('hidden');
        ui.views.history.classList.remove('hidden');
        HistoryManager.render();
    }
}

document.getElementById('btn-generate').addEventListener('click', () => {
    const raw = ui.input.value;
    if (!raw.trim()) return alert(getLanguageContent("alerts").text_empty);

    quizData = [];
    userAnswers = {};
    ui.container.innerHTML = '';
    ui.views.quiz.classList.add('hidden');
    ui.views.results.classList.add('hidden');
    ui.views.actions.classList.add('hidden');

    const normalized = normalizeText(raw);
    const blocks = normalized.split('___BLOCK___').filter(b => b.trim().length > 20);

    quizData = blocks.map((b, i) => parseBlock(b, i)).filter(q => q !== null);
    userAnswers = {};

    if (quizData.length === 0) {
        alert(getLanguageContent("alerts").no_questions);
        return;
    }

    renderQuiz();
});

function renderQuiz() {
    ui.container.innerHTML = '';

    ui.container.innerHTML = quizData.map((q, idx) => `
<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 fade-in">
    <div class="flex gap-4 mb-4">
        <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center text-sm">
            ${idx + 1}
        </div>
        <div class="text-lg text-slate-800 font-medium w-full leading-relaxed">
            ${q.question.replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <div class="space-y-2 ml-0 md:ml-12">
        ${q.options.map(opt => `
            <label class="flex items-start p-3 rounded-lg border border-slate-200 hover:bg-blue-50 cursor-pointer transition group select-none">
                <input type="radio" name="q-${q.id}" value="${opt.id}" class="mt-1 mr-3 accent-blue-600 w-4 h-4" onchange="userAnswers[${q.id}] = '${opt.id}'">
                <span class="text-slate-700 group-hover:text-slate-900">${opt.text}</span>
            </label>
        `).join('')}
    </div>

    <div id="feedback-${q.id}" class="hidden mt-6 ml-0 md:ml-12 p-4 rounded-lg bg-slate-50 border-l-4 border-slate-300">
        <p class="status-msg font-bold text-lg mb-1"></p>
        <div class="text-slate-700 text-sm leading-relaxed">
            <strong class="text-slate-900">${getDynamicText('quiz_explanation')}:</strong><br>
            ${q.justification || getDynamicText('quiz_no_explanation')}
        </div>
    </div>
</div>
`).join('');

    ui.views.input.classList.add('hidden');
    ui.views.history.classList.add('hidden');
    ui.views.quiz.classList.remove('hidden');
    ui.views.results.classList.add('hidden');
    ui.views.actions.classList.remove('hidden');

    window.scrollTo(0, 0);
    if (window.MathJax) MathJax.typesetPromise();
}

document.getElementById('btn-save-quiz').addEventListener('click', () => {
    if (quizData.length === 0) return;

    const saved = HistoryManager.save(quizData, 0, userAnswers, ui.input.value);
    alert(getDynamicText('history_saved').replace("{id}", saved.id));
});

document.getElementById('btn-save-completed').addEventListener('click', () => {
    if (quizData.length === 0) return;

    let score = 0;
    quizData.forEach(q => {
        if (userAnswers[q.id] === q.correctAnswer) {
            score++;
        }
    });

    const saved = HistoryManager.save(quizData, score, userAnswers, ui.input.value);
    alert(getDynamicText('history_saved_completed').replace("{percentage}", saved.percentage));
});

document.getElementById('btn-check').addEventListener('click', () => {
    let score = 0;
    quizData.forEach(q => {
        const selected = document.querySelector(`input[name="q-${q.id}"]:checked`);
        const fb = document.getElementById(`feedback-${q.id}`);
        const status = fb.querySelector('.status-msg');
        const inputs = document.querySelectorAll(`input[name="q-${q.id}"]`);

        inputs.forEach(i => i.disabled = true);
        fb.classList.remove('hidden');

        const isCorrect = selected && selected.value === q.correctAnswer;
        if (isCorrect) {
            score++;
            fb.className = "mt-6 ml-0 md:ml-12 p-4 rounded-lg bg-green-50 border-l-4 border-green-500 fade-in";
            status.innerHTML = `<span class="text-green-700">${getDynamicText('quiz_correct')}</span>`;
            selected.parentElement.classList.add('ring-2', 'ring-green-500', 'bg-green-100', 'border-green-500');
        } else {
            fb.className = "mt-6 ml-0 md:ml-12 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 fade-in";
            const gab = q.correctAnswer ? q.correctAnswer.toUpperCase() : '?';
            status.innerHTML = `<span class="text-red-700">${getDynamicText('quiz_wrong')} <strong>${gab}</strong></span>`;
            if (selected) selected.parentElement.classList.add('bg-red-100', 'border-red-300');

            if (q.correctAnswer) {
                const correct = document.querySelector(`input[name="q-${q.id}"][value="${q.correctAnswer}"]`);
                if (correct) correct.parentElement.classList.add('bg-green-100', 'border-green-500', 'font-bold');
            }
        }
    });

    const pct = Math.round((score / quizData.length) * 100);
    ui.score.innerHTML = `
<p class="text-xs font-bold text-slate-500 uppercase tracking-wider">${getDynamicText('history_score_label')}</p>
<div class="text-5xl font-black text-blue-600 my-3">${pct}%</div>
<p class="text-slate-700">${getDynamicText('quiz_score_sentence').replace('{score}', score).replace('{total}', quizData.length)}</p>
<div class="mt-4 text-sm text-slate-500">
    ${getDynamicText('quiz_save_hint')}
</div>
`;
    ui.views.results.classList.remove('hidden');
    ui.views.actions.classList.add('hidden');
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
});

function exportHistory() {
    HistoryManager.export();
}

function clearHistory() {
    if (confirm(getLanguageContent("alerts").confirm_clear_history)) {
        HistoryManager.clear();
        HistoryManager.render();
        alert(getDynamicText('history_cleared'));
    }
}

function deleteHistoryItem(id, buttonElement) {
    if (confirm(getLanguageContent("alerts").confirm_delete_simulado)) {
        HistoryManager.delete(id);
        const historyItem = buttonElement.closest('.history-item');
        if (historyItem) {
            historyItem.remove();
        }
        HistoryManager.updateHistoryCount();
        if (HistoryManager.load().length === 0) {
            HistoryManager.render();
        }
    }
}

function resetAndGoHome() {
    quizData = [];
    userAnswers = {};
    ui.container.innerHTML = '';
    ui.views.quiz.classList.add('hidden');
    ui.views.results.classList.add('hidden');
    ui.views.actions.classList.add('hidden');
    switchTab('create');
}

window.copyPrompt = function () {
    navigator.clipboard.writeText(document.getElementById('prompt-text').innerText);
    alert(getLanguageContent("alerts").prompt_copied);
};

document.addEventListener('DOMContentLoaded', () => {
    HistoryManager.updateHistoryCount();
});
