/*
    CHANGES IN THIS PULL REQUEST:

    Author: timo2009


    1. Multilanguage Support Enhanced:
       - Added and fully integrated Portuguese (pt-BR), English (en-EN), and German (de-DE) translations.
       - Dynamic texts (alerts, logs, quiz feedback, history labels) now use `contentDynamic` and `getDynamicText` for consistent localization.
       - Regex patterns for parsing questions, answers, and justifications now adapt per selected language.

    2. Parsing & Normalization Improvements:
       - `normalizeText()` updated to handle language-specific question patterns and block splitting.
       - `parseBlock()` fully supports language-dependent option regex, answer regex, and justification regex.
       - Ensures correct extraction of question text, options, answers, and justifications for multiple languages.

    3. UI & HTML Updates:
       - All static labels, buttons, and placeholders are now dynamically updated according to selected language via `updateTexts()`.
       - Added language selector dropdown for switching languages on the fly.
       - Improved HTML structure for quizzes, history, and input tabs to support multilingual content and responsive UI.
       - Added fade-in animations, improved Tailwind styling, and better visual feedback for quiz answers.

    4. History System Updates:
       - HistoryManager now stores multilingual-friendly metadata and displays dynamic labels.
       - Buttons for repeating simulations, viewing details, and deleting history items are fully localized.
       - Score display, explanations, and quiz feedback adapt to the selected language.

    5. Minor Refactors:
       - Consolidated repeated code in `parseBlock()` for cleaner logic.
       - Streamlined `switchTab()`, `renderQuiz()`, and history rendering to support multiple languages.
       - Log messages (console) are now dynamic per language for easier debugging and monitoring.

    Overall, this update ensures a complete multilingual experience, improves parsing reliability, and refactors the code for better maintainability and scalability.
*/

let content = {
    "pt-BR": {
        "title": "SimulAI",
        "description": "Crie Simulados e teste seu aprendizado!",
        "create": "Criar Simulado",
        "history": "Histórico",

        // generate
        "step_1": "1. Prompt (Copie e cole na IA)",
        "copy_prompt": "Copiar",
        "prompt_text": "Crie 5 questões sobre [TEMA].\n" +
            "Formato para CADA questão:\n" +
            "\n" +
            "Questão 1: [Enunciado]\n" +
            "A) [Texto]\n" +
            "B) [Texto]\n" +
            "C) [Texto]\n" +
            "D) [Texto]\n" +
            "✅ [Letra Correta]\n" +
            "💡 Justificativa: [Explicação]\n" +
            "---",
        "step_2": "2. Cole a resposta da IA:",
        "step_2_placeholder": "Cole aqui o texto...",
        "step_2_generate": "GERAR SIMULADO",

        // history
        "history_title": "Histórico de Simulados",
        "history_export": "Exportar",
        "history_clear": "Limpar Tudo",
        "no-history_1": "📝",
        "no-history_2": "Nenhum simulado no histórico ainda.",
        "no-history_3": "Complete um simulado para começar a guardar seus resultados!",

        // quiz
        "quiz_title": "Simulado",
        "save": "Salvar",
        "reset": "Reiniciar",
        "check": "Corrigir",
        "new": "Novo",
        "save_completed": "Salvar no Histórico",


        // script
        "regexPatterns": /(?:\n|^)\s*\**Quest[ãa]o\s*\d+/gi,
        "regexPatterns2": /\*\*(Quest[ãa]o \d+.*?)\*\*/gi,
        "splitPatterns": /(?:\n|^)\s*(?:✅|Gabarito:|Resposta:|Letra Correta|💡|Justificativa:)/i,
        "optionRegex": /(?:^|\n)\s*([A-Ea-e])[\)\.\-]\s+([\s\S]+?)(?=(?:\n\s*[A-Ea-e][\)\.\-]|$))/g,
        "questionRegex": /^(?:Questão\s+\d+|Question\s+\d+|\d+)[\.:\)]\s*/i,
        "answerRegex": /(?:✅|Gabarito|Resposta|Letra).*?([A-Ea-e])\b/i,
        "justificationRegex": /(?:💡|Justificativa:|Explicação:|Comentário:)([\s\S]*)/i,


        "download_prefix": "simulai_historico_",
        "alerts": {
            "text_empty": "Cole o texto primeiro!",
            "no_questions": "Não consegui identificar as questões. Verifique se copiou o texto completo.",
            "prompt_copied": "Prompt copiado!",
            "confirm_clear_history": "Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.",
            "confirm_delete_simulado": "Tem certeza que deseja deletar este simulado do histórico?"
        },
    },
    "en-EN": {
        "title": "SimulAI",
        "description": "Create simulations and test your learning!",
        "create": "Create Simulation",
        "history": "History",

        // generate
        "step_1": "1. Prompt (Copy and paste into the AI)",
        "copy_prompt": "Copy",
        "prompt_text": "Create 5 questions about [TOPIC].\n" +
            "Format for EACH question:\n" +
            "\n" +
            "Question 1: [Statement]\n" +
            "A) [Text]\n" +
            "B) [Text]\n" +
            "C) [Text]\n" +
            "D) [Text]\n" +
            "✅ [Correct Option]\n" +
            "💡 Explanation: [Reasoning]\n" +
            "---",
        "step_2": "2. Paste the AI response:",
        "step_2_placeholder": "Paste the text here...",
        "step_2_generate": "GENERATE SIMULATION",

        // history
        "history_title": "Simulation History",
        "history_export": "Export",
        "history_clear": "Clear All",
        "no-history_1": "📝",
        "no-history_2": "No simulations in the history yet.",
        "no-history_3": "Complete a simulation to start saving your results!",

        // quiz
        "quiz_title": "Simulation",
        "save": "Save",
        "reset": "Reset",
        "check": "Check",
        "new": "New",
        "save_completed": "Save to History",

        // script
        "regexPatterns": /(?:\n|^)\s*\**Question\s*\d+/gi,
        "regexPatterns2": /\*\*(Question \d+.*?)\*\*/gi,
        "splitPatterns": /(?:\n|^)\s*(?:✅|Answer:|Correct Option|💡|Explanation:)/i,

        "optionRegex": /(?:^|\n)\s*([A-Ea-e])[\)\.\-]\s+([\s\S]+?)(?=(?:\n\s*[A-Ea-e][\)\.\-]|$))/g,
        "questionRegex": /^(?:Question\s+\d+|\d+)[\.:\)]\s*/i,
        "answerRegex": /(?:✅|Answer|Correct Option|Option).*?([A-Ea-e])\b/i,
        "justificationRegex": /(?:💡|Explanation:|Comment:)([\s\S]*)/i,

        "download_prefix": "simulai_history_",
        "alerts": {
            "text_empty": "Paste the text first!",
            "no_questions": "Could not identify the questions. Make sure you've copied the full text.",
            "prompt_copied": "Prompt copied!",
            "confirm_clear_history": "Are you sure you want to clear all history? This action cannot be undone.",
            "confirm_delete_simulado": "Are you sure you want to delete this simulation from the history?"
        },


    },
    "de-DE": {
        "title": "SimulAI",
        "description": "Erstellen Sie Simulationen und testen Sie Ihr Wissen!",
        "create": "Simulation erstellen",
        "history": "Verlauf",

        // generate
        "step_1": "1. Prompt (Kopieren und in die KI einfügen)",
        "copy_prompt": "Kopieren",
        "prompt_text": "Erstelle 5 Fragen zu [THEMA].\n" +
            "Format für JEDE Frage:\n" +
            "\n" +
            "Frage 1: [Aussage]\n" +
            "A) [Text]\n" +
            "B) [Text]\n" +
            "C) [Text]\n" +
            "D) [Text]\n" +
            "✅ [Richtige Antwort]\n" +
            "💡 Begründung: [Erklärung]\n" +
            "---",
        "step_2": "2. Fügen Sie die KI-Antwort ein:",
        "step_2_placeholder": "Fügen Sie hier den Text ein...",
        "step_2_generate": "SIMULATION ERSTELLEN",

        // history
        "history_title": "Simulationsverlauf",
        "history_export": "Exportieren",
        "history_clear": "Alles löschen",
        "no-history_1": "📝",
        "no-history_2": "Keine Simulationen im Verlauf gefunden.",
        "no-history_3": "Beenden Sie eine Simulation, um Ihre Ergebnisse zu speichern!",

        // quiz
        "quiz_title": "Simulation",
        "save": "Speichern",
        "reset": "Zurücksetzen",
        "check": "Überprüfen",
        "new": "Neu",
        "save_completed": "Zum Verlauf hinzufügen",

        // script
        "regexPatterns": /(?:\n|^)\s*\**Frage\s*\d+/gi,
        "regexPatterns2": /\*\*(Frage \d+.*?)\*\*/gi,
        "splitPatterns": /(?:\n|^)\s*(?:✅|Antwort:|Richtige Antwort|💡|Begründung:)/i,
        "optionRegex": /(?:^|\n)\s*([A-Ea-e])[\)\.\-]\s+([\s\S]+?)(?=(?:\n\s*[A-Ea-e][\)\.\-]|$))/g,
        "questionRegex": /^(?:Frage\s+\d+|\d+)[\.:\)]\s*/i,
        "answerRegex": /(?:✅|Antwort|Richtige Antwort|Option).*?([A-Ea-e])\b/i,
        "justificationRegex": /(?:💡|Begründung:|Kommentar:)([\s\S]*)/i,

        "download_prefix": "simulai_verlauf_",
        "alerts": {
            "text_empty": "Fügen Sie zuerst den Text ein!",
            "no_questions": "Fragen konnten nicht identifiziert werden. Stellen Sie sicher, dass der vollständige Text kopiert wurde.",
            "prompt_copied": "Prompt kopiert!",
            "confirm_clear_history": "Möchten Sie wirklich den gesamten Verlauf löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
            "confirm_delete_simulado": "Möchten Sie diesen Simulado wirklich aus dem Verlauf löschen?"
        },
    },
}

let contentDynamic = {
    "pt-BR": {
        history_repeat: "🔄 Repetir",
        history_details: "👁️ Detalhes",
        history_score_label: "Resultado",
        history_correct: "✅ Correta",
        history_wrong: "❌ Errada",
        history_not_answered: "Não respondida",
        history_explanation: "💡 Justificativa",
        quiz_explanation: "💡 Explicação",
        quiz_correct: "✅ Correto!",
        quiz_wrong: "❌ Errado.",
        quiz_save_hint: "💾 Clique em 'Salvar no Histórico' para guardar este resultado!",
        history_cleared: "Histórico limpo com sucesso!",
        history_saved: "Simulado salvo no histórico! ID: {id}",
        history_saved_completed: "Simulado salvo no histórico com {percentage}%! ",
        log_normalize: "🧹 Normalizando texto...",
        log_parse_block: "📝 Processando bloco {index}...",
        log_parse_question: "❓ Extraindo pergunta...",
        log_parse_solution: "💡 Extraindo solução...",
        log_save_history: "💾 Salvando simulado no histórico...",
        log_delete_history: "🗑️ Deletando simulado {id} do histórico...",
        log_clear_history: "🧹 Limpando todo o histórico...",
        history_theme_unknown: "Tema não identificado",
        quiz_question_identifier: "Questão",
        history_theme: "Tema",
        history_date: "Data",
        history_at: "às",
        history_result: "Resultado",
        history_questions_answers: "QUESTÕES E RESPOSTAS",
        history_user_answer: "Suas opções",
        history_correct_answer: "Gabarito",
        quiz_no_explanation: "Sem justificativa disponível.",
        quiz_score_sentence: "Você acertou {score} de {total} questões.",

    },
    "en-EN": {
        history_repeat: "🔄 Repeat",
        history_details: "👁️ Details",
        history_score_label: "Result",
        history_correct: "✅ Correct",
        history_wrong: "❌ Wrong",
        history_not_answered: "Not answered",
        history_explanation: "💡 Explanation",
        quiz_explanation: "💡 Explanation",
        quiz_correct: "✅ Correct!",
        quiz_wrong: "❌ Wrong.",
        quiz_save_hint: "💾 Click 'Save to History' to store this result!",
        history_cleared: "History cleared successfully!",
        history_saved: "Simulation saved to history! ID: {id}",
        history_saved_completed: "Simulation saved to history with {percentage}%!",
        log_normalize: "🧹 Normalizing text...",
        log_parse_block: "📝 Processing block {index}...",
        log_parse_question: "❓ Extracting question...",
        log_parse_solution: "💡 Extracting solution...",
        log_save_history: "💾 Saving simulation to history...",
        log_delete_history: "🗑️ Deleting simulation {id} from history...",
        log_clear_history: "🧹 Clearing all history...",
        history_theme_unknown: "Topic not identified",
        quiz_question_identifier: "Question",
        history_theme: "Topic",
        history_date: "Date",
        history_at: "at",
        history_result: "Result",
        history_questions_answers: "QUESTIONS AND ANSWERS",
        history_user_answer: "Your answers",
        history_correct_answer: "Correct answer",
        quiz_no_explanation: "No explanation available.",
        quiz_score_sentence: "You got {score} out of {total} questions correct.",
    },
    "de-DE": {
        history_repeat: "🔄 Wiederholen",
        history_details: "👁️ Details",
        history_score_label: "Ergebnis",
        history_correct: "✅ Richtig",
        history_wrong: "❌ Falsch",
        history_not_answered: "Nicht beantwortet",
        history_explanation: "💡 Begründung",
        quiz_explanation: "💡 Erklärung",
        quiz_correct: "✅ Richtig!",
        quiz_wrong: "❌ Falsch.",
        quiz_save_hint: "💾 Klicken Sie auf 'Zum Verlauf hinzufügen', um dieses Ergebnis zu speichern!",
        history_cleared: "Verlauf erfolgreich gelöscht!",
        history_saved: "Simulation im Verlauf gespeichert! ID: {id}",
        history_saved_completed: "Simulation im Verlauf gespeichert mit {percentage}%!",
        log_normalize: "🧹 Text wird normalisiert...",
        log_parse_block: "📝 Block {index} wird verarbeitet...",
        log_parse_question: "❓ Frage wird extrahiert...",
        log_parse_solution: "💡 Lösung wird extrahiert...",
        log_save_history: "💾 Simulation wird im Verlauf gespeichert...",
        log_delete_history: "🗑️ Simulation {id} wird aus dem Verlauf gelöscht...",
        log_clear_history: "🧹 Gesamter Verlauf wird gelöscht...",
        history_theme_unknown: "Thema nicht erkannt",
        quiz_question_identifier: "Frage",
        history_theme: "Thema",
        history_date: "Datum",
        history_at: "um",
        history_result: "Ergebnis",
        history_questions_answers: "FRAGEN UND ANTWORTEN",
        history_user_answer: "Ihre Antworten",
        history_correct_answer: "Richtige Antwort",
        quiz_no_explanation: "Keine Begründung verfügbar.",
        quiz_score_sentence: "Sie haben {score} von {total} Fragen richtig beantwortet.",

    }
};
function getLanguageContent(text) {
    return content[SettingsManager.getLanguage()][text]
}

function getDynamicText(key) {
    return contentDynamic[SettingsManager.getLanguage()][key] || key;
}

function switchLanguage(lang) {
    SettingsManager.setLanguage(lang); // speichern
    updateTexts(); // Texte aktualisieren

    const selector = document.getElementById('language-selector');
    if (selector) selector.value = lang;
}

function updateTexts() {
    document.querySelector("#app-title").textContent = getLanguageContent("title");
    document.querySelector("#app-description").textContent = getLanguageContent("description");
    document.querySelector("#tab-create").textContent = `📝 ${getLanguageContent("create")}`;
    document.querySelector("#tab-history").innerHTML = `📚 ${getLanguageContent("history")} <span id="history-count" class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">0</span>`;
    document.querySelector("#prompt-label").textContent = getLanguageContent("step_1");
    document.querySelector("#prompt-copy").textContent = getLanguageContent("copy_prompt");
    document.querySelector("#prompt-text").textContent = getLanguageContent("prompt_text");
    document.querySelector("#step-2-label").textContent = getLanguageContent("step_2");
    document.querySelector("#ai-input").placeholder = getLanguageContent("step_2_placeholder");
    document.querySelector("#btn-generate").textContent = getLanguageContent("step_2_generate");
    document.querySelector("#history-title").textContent = `📚 ${getLanguageContent("history_title")}`;
    document.querySelector("#btn-history-export").textContent = `📥 ${getLanguageContent("history_export")}`;
    document.querySelector("#btn-history-clear").textContent = `🗑️ ${getLanguageContent("history_clear")}`;
    document.querySelector("#no-history-icon").textContent = getLanguageContent("no-history_1");
    document.querySelector("#no-history-text-1").textContent = getLanguageContent("no-history_2");
    document.querySelector("#no-history-text-2").textContent = getLanguageContent("no-history_3");

    document.querySelector("#quiz-title").textContent = getLanguageContent("quiz_title");
    document.querySelector("#btn-save-quiz").textContent = `💾 ${getLanguageContent("save")}`;
    document.querySelector("#btn-check").textContent = getLanguageContent("check");
    document.querySelector("#btn-save-completed").textContent = `💾 ${getLanguageContent("save_completed")}`;
    document.querySelector("#btn-reset").textContent = getLanguageContent("reset");
    document.querySelector("#btn-new-quiz").textContent = getLanguageContent("new");
}